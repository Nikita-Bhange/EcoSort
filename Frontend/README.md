# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.













body{
  background-color: #C3F3C0;
}
.container{
  border: 2px solid rgb(18, 116, 59);
  margin-top: 150px;
  margin-left: 560px;
  width: 380px;
  height: 100%;
  background-color: white;
  /* padding: 5px; */
  /* border-radius: 10px; */
}
.container .heading{
  width: 100%;
  height: 80px;
  background-color: rgb(18, 116, 59);
  margin-top: -20px;
  /* border-radius: 8px; */
}
.container .heading h3{
  margin-left: 140px;
  font-size: 30px;
  margin-top: 20px;
  padding-top: 10px;
  color: white;
  font-style: italic;
  font-family: Georgia, 'Times New Roman', Times, serif;
}
.container .form-container{
  border: 1px solid green;
  width: 100%;
  height: 75%;
}
.container .form-container .form-toggle{
  padding: 20px 20px 0px 33px;
  /* padding-left: 40px; */
}
.container .form-container .form-toggle .active{
  background-color: rgb(18, 116, 59);
  color: white;
}
.container .form-container .form-toggle button{
  width: 150px;
  font-size: 20px;
  margin-left: 5px;
  color: rgb(18, 116, 59);
  border: 2px solid rgb(18, 116, 59);
  border-radius: 10px;
  padding: 5px;
  background-color: white;
}
.container .form-container .form-toggle button:hover{
  cursor: pointer;
}
.container .form-container .form{
  padding: 0px 18px 0px 18px;
}
.container .form-container .form h2{
  color: rgb(9, 87, 46);
  margin-left: 113px;
}
.container .form-container .form input{
  width: 92%;
  margin: 0px 0px 15px 0px;
  padding: 13px;
  border-bottom: 2px solid green;
  color: rgb(9, 87, 46);
}
.container .form-container .form input:active{
  border: 2px solid rgb(9, 87, 46);
}
.container .form-container .form a{
  margin-left: 210px;
}
.container .form-container .form button{
  width: 100%;
  padding: 8px;
  margin-top: 15px;
  font-size: 20px;
  border-radius: 8px;
  color: white;
  background-color: rgb(9, 87, 46);
  border: none;
  margin-bottom: 15px;
}
.container .form-container .form button:hover{
  cursor: pointer;
  background-color: white;
  border: 2px solid rgb(9, 87, 46);
  color: rgb(9, 87, 46);
}
.container .form-container .form p{
  margin-left: 70px;
  margin-top: 0px;
}
.container .form-container .form p a{
  margin-left: 0px;
}