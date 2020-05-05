#!/bin/bash

# Designed for Ubuntu 16.04

#################################################################################
########################## Install and Setup Database ###########################
#################################################################################

# Update package list
apt update

# Install MariaDB
apt install -y mariadb-server mariadb-client

# Enable and start MariaDB
systemctl enable mysql
systemctl start mysql

# Request root password for database
echo "Please enter a password for the root user in the database: "
read MYSQL_ROOT_PASS

# Request password for app user
echo "Please enter a password for the app's user in the database: "
read MYSQL_USER_PASS

# MariaDB setup
mysql -u root <<-EOF
CREATE DATABASE LICCB;
UPDATE mysql.user SET Password=PASSWORD('$MYSQL_ROOT_PASS') WHERE User='root';
CREATE USER 'liccb'@'%' IDENTIFIED BY '$MYSQL_USER_PASS';
GRANT ALL PRIVILEGES ON LICCB.* TO 'liccb'@'%';
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');
DELETE FROM mysql.user WHERE User='';
DELETE FROM mysql.db WHERE Db='test' OR Db='test_%';
FLUSH PRIVILEGES;
EOF

# Database setup
mysql -u liccb -p $MYSQL_USER_PASS LICCB < dbschema.sql
mysql -u liccb -p $MYSQL_USER_PASS LICCB < dummyRows.sql

#################################################################################
############################## Node and App Setup ###############################
#################################################################################

# Add repository for NodeJS 12
curl -sL https://deb.nodesource.com/setup_12.x -o nodesource_setup.sh
bash nodesource_setup.sh

# Update package list
apt update

# Install NodeJS
apt install -y nodejs

# Install node modules
npm install

# Request various config parameters from the user
echo "Please enter the google.clientID: "
read GOOGLE_CLIENTID
echo "Please enter the google.clientSecret: "
read GOOGLE_CLIENTSECRET
echo "Please enter a session cookieKey: "
read SESSION_COOKIEKEY
echo "Please enter the mailer account: "
read MAILER_ACCOUNT
echo "Please enter the mailer password: "
read MAILER_PASS
echo "Please enter the server's domain name: "
read LICCB_HOSTNAME

# Create app config
tee config.json << EOF
{
    "database": {
        "host": "localhost",
        "user": "liccb",
        "password": "$MYSQL_USER_PASS"
    },
    "email": {
        "host": "smtp.gmail.com",
        "port": 587,
        "user": "$MAILER_ACCOUNT",
        "password": "$MAILER_PASS",
        "body": {
            "emailConfirmation": "<h1>LICCB</h1><p>Please click the link below to confirm your email address:<p><a href=\${link}>Confirm Email</a>",
            "editRegistration": "<h1>LICCB</h1><p>You may edit your registration for the \"\${eventName}\" event via the link below.<p><a href=\${link}>Edit Registration</a>",
            "timeChange": "<h1>LICCB</h1><p>The times for the \"\${eventName}\" event have changed from: <br> \${oldTime} <br> to <br> \${newTime} <br> <br> If necessary, please cancel your registration via the link below.<p><a href=\${link}>Edit Registration</a>"
        },
        "link": {
            "emailConfirmation": "https://$LICCB_HOSTNAME/confirmEmail/\${eventID}/\${registrantID}",
            "editRegistration": "https://$LICCB_HOSTNAME/editRegistration/\${eventID}/\${registrantID}",
            "timeChange": "https://$LICCB_HOSTNAME/editRegistration/\${eventID}/\${registrantID}"
        }
    },
    "keys": {
        "google": {
            "clientID": "$GOOGLE_CLIENTID",
            "clientSecret": "$GOOGLE_CLIENTSECRET"
        },
        "session": {
            "cookieKey": "$SESSION_COOKIEKEY"
        }
    }
}
EOF

#################################################################################
########################### Certbot Install and Setup ###########################
#################################################################################

# Update package list
apt update

# Install certbot
apt install -y certbot

# Request email for LetsEncrypt notifications to be sent to
echo "Please enter an email to send LetsEncrypt alerts and warnings to: "
read CERTBOT_EMAIL

# Install LetsEncrypt certificate
certbot certonly --standalone --noninteractive --agree-tos --email $CERTBOT_EMAIL -d $LICCB_HOSTNAME

#################################################################################
############################ Service Setup and Start ############################
#################################################################################

# Create systemd service file
echo "[Unit]" > /lib/systemd/system/event-manager.service
echo "Description=LICCB Event Manager Webapp" >> /lib/systemd/system/event-manager.service
echo "After=network-online.target" >> /lib/systemd/system/event-manager.service
echo "[Service]" >> /lib/systemd/system/event-manager.service
echo "Type=simple" >> /lib/systemd/system/event-manager.service
echo "WorkingDirectory=$PWD" >> /lib/systemd/system/event-manager.service
echo "ExecStart=$(which npm) start" >> /lib/systemd/system/event-manager.service
echo "[Install]" >> /lib/systemd/system/event-manager.service
echo "WantedBy=multi-user.target" >> /lib/systemd/system/event-manager.service

# Enable and start systemd service
systemctl enable event-manager
systemctl start event-manager