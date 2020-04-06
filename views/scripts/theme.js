function switchTheme() {
  var check = document
  .getElementById('theme_css')
  .classList[0] === 'style';

  var element = document.getElementById('theme_css');


  if (check) {
   element.href = '/css/style-dark.css';
   element.classList.remove('style')
   element.classList.add('style-dark');
  } else {
   element.href = '/css/style.css';
   element.classList.remove('style-dark')
   element.classList.add('style');
  }
}
