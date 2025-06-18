import http from 'http';
import express from "express";
import session from 'express-session';
import cookieParser from 'cookie-parser';

const porta = 3001;
const host = "localhost";
const app = express();
var lista_de_times = [];
var lista_de_jogadores = [];

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "M1nh4Ch4v3S3cr3t4",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 15, httpOnly: true, secure: false }
}));

app.use(cookieParser());
function verautc(req, res, next){
    if(req.session.logado){
        next();
    } else {
        res.redirect("/");
    }
}

app.get("/", (req, res) => {
    res.send(`
    <!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Voleibol Amador</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" />
  <style>
    html, body {
      height: 100%;
      margin: 0;
      background: linear-gradient(to right, #0057b7, #00cfff);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .main-wrapper {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .content-container {
      background-color: #002f6c;
      color: white;
      width: 100%;
      max-width: 800px;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }
    .content-container h1 {
      color: #ffcc00;
      margin-bottom: 20px;
      text-align: center;
    }
    .form-label {
      color: #ffcc00;
      font-weight: 500;
    }
    .btn-primary {
      background-color: #ffcc00;
      color: #002f6c;
      border: none;
      width: 100%;
      margin-top: 15px;
    }
    .btn-primary:hover {
      background-color: #ad8b00;
      color: #183861;
    }
  </style>
</head>
<body>
  <div class="main-wrapper">
    <div class="content-container">
      <form method="POST" action="/">
        <h1>Login</h1>
        <div class="mb-3">
          <label for="usuario" class="form-label">Usuário</label>
          <input type="text" class="form-control" id="usuario" name="usuario" />
        </div>
        <div class="mb-3">
          <label for="senha" class="form-label">Senha</label>
          <input type="password" class="form-control" id="senha" name="senha"  />
        </div>
        <button type="submit" class="btn btn-primary">Entrar</button>
      </form>
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
    `); 
    res.end();      
 });

 app.post("/", (req, res) => {
    const usuario = req.body.usuario;
    const senha = req.body.senha;
    
    if(usuario && senha) {
        req.session.logado = true;
        
        const data = new Date();
        res.cookie("ultimoLogin", data.toLocaleString(), { maxAge: 1000 * 60 * 60 * 24 * 30,});
        res.cookie("usuario", usuario, { maxAge: 1000 * 60 * 60 * 24 * 30 });
        res.redirect("/menu");
    } else {
        res.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Voleibol Amador</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" />
          <style>
            html, body {
              height: 100%;
              margin: 0;
              background: linear-gradient(to right, #0057b7, #00cfff);
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            .main-wrapper {
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .content-container {
              background-color: #002f6c;
              color: white;
              width: 100%;
              max-width: 800px;
              padding: 30px;
              border-radius: 15px;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            }
            .content-container h1 {
              color: #ffcc00;
              margin-bottom: 20px;
              text-align: center;
            }
            .form-label {
              color: #ffcc00;
              font-weight: 500;
            }
            .btn-primary {
              background-color: #ffcc00;
              color: #002f6c;
              border: none;
              width: 100%;
              margin-top: 15px;
            }
            .btn-primary:hover {
              background-color: #ad8b00;
              color: #183861;
            }
            .erro {
                color: rgb(255, 179, 179);
                text-shadow:
                  0 0 2px #ff0000,
                  0 0 3px #fc0606f5,
                  0 0 4px #fa0707de,
                  0 0 8px #ff0c0cb6,
                  0 0 16px #ff1a1a93,
                  0 0 32px #ff33336b,
                  0 0 64px #ff4d4d60,
                  0 0 128px #ff4d4d21;
              }
          </style>
        </head>
        <body>
          <div class="main-wrapper">
            <div class="content-container">
              <form method="POST" action="/">
                <h1>Login</h1>
                <div class="mb-3">
                  <label for="usuario" class="form-label">Usuário</label>
                  <input type="text" class="form-control" id="usuario" name="usuario" />
                </div>
                <div class="mb-3">
                  <label for="senha" class="form-label">Senha</label>
                  <input type="password" class="form-control" id="senha" name="senha"  />
                </div>
                <div>
                  <span class="erro">Usuário ou senha inválidos</span>
                </div>
                <button type="submit" class="btn btn-primary">Entrar</button>
              </form>
            </div>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
        `); 
        res.end();   
    }
});

app.get("/menu",verautc , (req, res) => {
    
    res.send(`  
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Voleibol Amador</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" />
      <style>
        html, body {
          margin: 0;
          padding: 0;
          min-height: 100%;
          background: linear-gradient(to right, #0057b7, #00cfff);
          color: #fff;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .navbar {
          background-color: #0066ec !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        .navbar-brand, .nav-link {
          color: #fff !important;
          font-weight: 600;
          transition: color 0.3s ease;
          margin: 5px;
        }
        .nav-link{
            border: 1px solid #002a5e;
            border-radius: 5px;
            background-color: #002a5e;
        }
        .navbar-brand:hover, .nav-link:hover {
          color: #ffcc00 !important;
        }
        .navbar .dropdown-toggle:hover {
        background-color: #ffcc00 !important;
        color: #002a5e !important;
        transition: 0.3s ease;
        }
        .content-container {
            display: block;
          justify-content: center;
          align-items: center;  
          background-color: rgba(255, 255, 255, 0.95);
          color: #002f6c;
          max-width: 800px;
          margin: 80px auto;
          padding: 40px 30px;
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          text-align: center;
          min-height: 300px;
        }
        .content-container h1 {
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          font-weight: 700;
          margin-bottom: 20px;
        }
        .content-container a {
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          display: block;
          justify-content: center;
          align-items: center;
          margin: 10px;  
        }
        footer {
          text-align: center;
          background-color: #002a5e;
          color: rgb(202, 202, 202);
          bottom: 0;
          position: fixed;
          width: 100%;
        }
      </style>
    </head>
    <body>
      <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
          <a class="navbar-brand d-flex align-items-center" href="/menu">
            Voleibol FIPP
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle btn btn-outline-light fw-semibold px-3 py-2 rounded" href="/menu" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="background-color: #004fc4; border: none;">
                      Menu de Cadastros
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end">
                      <li><a class="dropdown-item" href="/cadastro-de-time">Cadastro de Equipe/Time</a></li>
                      <li><a class="dropdown-item" href="/cadastro-de-jogador">Cadastro de Jogador</a></li>
                    </ul>
                  </li>
                  <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle btn btn-outline-light fw-semibold px-3 py-2 rounded" href="/menu" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="background-color: #004fc4; border: none;">
                      Menu de Listas
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end">
                      <li><a class="dropdown-item" href="/lista-de-times">Lista de Equipes/Times</a></li>
                      <li><a class="dropdown-item" href="/lista_de_jogadores">Lista de Jogadores</a></li>
                    </ul>
                  </li>
              <li class="nav-item">
                <a class="nav-link active" href="/">Login</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/logout">Logout</a>
              </li>
              <li class="nav-item">
                <p class="nav-link mb-0">${req.cookies.ultimoLogin ? "Último Login: " + req.cookies.ultimoLogin : ""}</p>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div class="content-container">
        <h1>Escolha uma opção para cadastrar:</h1>
        <a class="btn btn-warning" href="/cadastro-de-time">Cadastrar Equipe/time</a>
        <a class="btn btn-warning" href="/cadastro-de-jogador">Cadastrar Jogador</a>
        <a class="btn btn-warning" href="/lista-de-times">Lista de Equipes/times</a>
        <a class="btn btn-warning" href="/lista_de_jogadores">Lista de Jogadores</a>
      </div>
      <footer>
           <p>2025 Voleibol FIPP | Todos os direitos reservados</p>
      </footer>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
    `);
    res.end();
});

app.get("/cadastro-de-time", verautc , (req, res) => {
  

  res.send(`
  <!DOCTYPE html>
  <html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Voleibol Amador</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        min-height: 100%;
        background: linear-gradient(to right, #0057b7, #00cfff);
        color: #fff;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      .navbar {
        background-color: #0066ec !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
      .navbar-brand, .nav-link {
        color: #fff !important;
        font-weight: 600;
        transition: color 0.3s ease;
        margin: 5px;
      }
      .nav-link {
        border: 1px solid #002a5e;
        border-radius: 5px;
        background-color: #002a5e;
      }
      .navbar-brand:hover, .nav-link:hover {
        color: #ffcc00 !important;
      }
      .navbar .dropdown-toggle:hover {
        background-color: #ffcc00 !important;
        color: #002a5e !important;
        transition: 0.3s ease;
      }
      .main-wrapper {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding: 100px 15px 140px; 
      }
      .content-container {
        background-color: #002f6c;
        border: #183861 2px solid;
        color: white;
        width: 100%;
        max-width: 800px;
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 10px 25px #2b2200;
        text-align: center;
      }
      .content-container h1 {
        color: #ffcc00;
        margin-bottom: 30px;
      }
      .form-label {
        color: #ffcc00;
        font-weight: 500;
      }
      .btn-primary {
        background-color: #ffcc00;
        color: #002f6c;
        border: none;
        width: 100%;
        margin-top: 15px;
      }
      .btn-primary:hover {
        background-color: #ad8b00;
        color: #183861;
      }
      footer {
        text-align: center;
        background-color: #002a5e;
        color: rgb(202, 202, 202);
        width: 100%;
        padding: 15px 10px;
      }
    </style>
  </head>
  <body>
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center" href="/menu">
          Voleibol FIPP
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle btn btn-outline-light fw-semibold px-3 py-2 rounded" href="/menu" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="background-color: #004fc4; border: none;">
                Menu de Cadastros
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="/cadastro-de-time">Cadastro de Equipe/Time</a></li>
                <li><a class="dropdown-item" href="/cadastro-de-jogador">Cadastro de Jogador</a></li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle btn btn-outline-light fw-semibold px-3 py-2 rounded" href="/menu" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="background-color: #004fc4; border: none;">
                Menu de Listas
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="/lista-de-times">Lista de Equipes/Times</a></li>
                <li><a class="dropdown-item" href="/lista_de_jogadores">Lista de Jogadores</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <a class="nav-link active" href="/">Login</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/logout">Logout</a>
            </li>
            <li class="nav-item">
              <p class="nav-link mb-0">${req.cookies.ultimoLogin ? "Último Login: " + req.cookies.ultimoLogin : ""}</p>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="main-wrapper">
      <div class="content-container">
        <h1>Cadastrar Equipe/Time</h1>
        <form method="POST" action="/cadastro-de-time">
          <div class="mb-3">
            <label for="time" class="form-label">Nome da Equipe/Time</label>
            <input type="text" class="form-control" id="time" name="time" />
          </div>
          <div class="mb-3">
            <label for="responsavel" class="form-label">Nome do Responsável</label>
            <input type="text" class="form-control" id="responsavel" name="responsavel" />
          </div>
          <div class="mb-3">
            <label for="telefone" class="form-label">Telefone</label>
            <input type="tel" class="form-control" id="telefone" name="telefone" />
          </div>
          <button type="submit" class="btn btn-primary">Cadastrar</button>
        </form>
      </div>
    </div>
    <footer>
      <p>2025 Voleibol FIPP | Todos os direitos reservados</p>
    </footer>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
  </body>
  </html>  
  `);  
  res.end();
});

app.post("/cadastro-de-time", verautc , (req, res) => {
    const time = req.body.time;
    const responsavel = req.body.responsavel;
    const telefone = req.body.telefone;
    
    if(time && responsavel && telefone) {
      lista_de_times.push({
          time: time,
          responsavel: responsavel,
          telefone: telefone
      });
      res.redirect("/lista-de-times");
  } else {


    let conteudo = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Voleibol Amador</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" />
      <style>
        html, body {
          margin: 0;
          padding: 0;
          min-height: 100%;
          background: linear-gradient(to right, #0057b7, #00cfff);
          color: #fff;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .navbar {
          background-color: #0066ec !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        .navbar-brand, .nav-link {
          color: #fff !important;
          font-weight: 600;
          transition: color 0.3s ease;
          margin: 5px;
        }
        .nav-link {
          border: 1px solid #002a5e;
          border-radius: 5px;
          background-color: #002a5e;
        }
        .navbar-brand:hover, .nav-link:hover {
          color: #ffcc00 !important;
        }
        .navbar .dropdown-toggle:hover {
          background-color: #ffcc00 !important;
          color: #002a5e !important;
          transition: 0.3s ease;
        }
        .main-wrapper {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 100px 15px 140px; 
        }
        .content-container {
          background-color: #002f6c;
          border: #183861 2px solid;
          color: white;
          width: 100%;
          max-width: 800px;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 10px 25px #2b2200;
          text-align: center;
        }
        .content-container h1 {
          color: #ffcc00;
          margin-bottom: 30px;
        }
        .form-label {
          color: #ffcc00;
          font-weight: 500;
        }
        .btn-primary {
          background-color: #ffcc00;
          color: #002f6c;
          border: none;
          width: 100%;
          margin-top: 15px;
        }
        .btn-primary:hover {
          background-color: #ad8b00;
          color: #183861;
        }
        footer {
          text-align: center;
          background-color: #002a5e;
          color: rgb(202, 202, 202);
          width: 100%;
          padding: 15px 10px;
        }
        .erro {
          color: rgb(255, 179, 179);
          text-shadow:
            0 0 2px #ff0000,
            0 0 3px #fc0606f5,
            0 0 4px #fa0707de,
            0 0 8px #ff0c0cb6,
            0 0 16px #ff1a1a93,
            0 0 32px #ff33336b,
            0 0 64px #ff4d4d60,
            0 0 128px #ff4d4d21;
        }
      </style>
    </head>
    <body>
      <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
          <a class="navbar-brand d-flex align-items-center" href="/menu">
            Voleibol FIPP
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle btn btn-outline-light fw-semibold px-3 py-2 rounded" href="/menu" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="background-color: #004fc4; border: none;">
                  Menu de Cadastros
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item" href="/cadastro-de-time">Cadastro de Equipe/Time</a></li>
                  <li><a class="dropdown-item" href="/cadastro-de-jogador">Cadastro de Jogador</a></li>
                </ul>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle btn btn-outline-light fw-semibold px-3 py-2 rounded" href="/menu" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="background-color: #004fc4; border: none;">
                  Menu de Listas
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item" href="/lista-de-times">Lista de Equipes/Times</a></li>
                  <li><a class="dropdown-item" href="/lista_de_jogadores">Lista de Jogadores</a></li>
                </ul>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="/">Login</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/logout">Logout</a>
              </li>
              <li class="nav-item">
                <p class="nav-link mb-0">${req.cookies.ultimoLogin ? "Último Login: " + req.cookies.ultimoLogin : ""}</p>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div class="main-wrapper">
        <div class="content-container">
          <h1>Cadastrar Equipe/Time</h1>
          <form method="POST" action="/cadastro-de-time">
    `;
    if(!time){
      conteudo+=`
      <div class="mb-3">
            <label for="time" class="form-label">Nome da Equipe/Time</label>
            <input type="text" class="form-control" id="time" name="time" />
            <span class="erro">Nome do Time Invalido</span>
          </div>
      `;
    }else{
       conteudo +=`
       <div class="mb-3">
            <label for="time" class="form-label">Nome da Equipe/Time</label>
            <input type="text" class="form-control" id="time" name="time" />
          </div>
       `;
    }
    if(!responsavel){
      conteudo+=`
      <div class="mb-3">
      <label for="responsavel" class="form-label">Nome do Responsável</label>
      <input type="text" class="form-control" id="responsavel" name="responsavel" />
      <span class="erro">Nome do Responsável Invalido</span>
      </div>
      `;
    }else{
      conteudo+=`
      <div class="mb-3">
      <label for="responsavel" class="form-label">Nome do Responsável</label>
      <input type="text" class="form-control" id="responsavel" name="responsavel" />
    </div>
      `;
    }
    if(!telefone){
     conteudo+=`
     <div class="mb-3">
     <label for="telefone" class="form-label">Telefone</label>
     <input type="tel" class="form-control" id="telefone" name="telefone" />
     <span class="erro">Telefone Invalido</span>
   </div>
     `;
    }else{
      conteudo+=`
      <div class="mb-3">
      <label for="telefone" class="form-label">Telefone</label>
      <input type="tel" class="form-control" id="telefone" name="telefone" />
    </div>`;
    }  
    conteudo+=`
    <button type="submit" class="btn btn-primary">Cadastrar</button>
        </form>
      </div>
    </div>
    <footer>
      <p>2025 Voleibol FIPP | Todos os direitos reservados</p>
    </footer>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
  </body>
  </html>  
    `;
    res.send(conteudo);
    res.end();
  }
});

app.get("/lista-de-times", verautc , (req, res) => {
    let conteudo = `
    <!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Voleibol Amador</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" />
  <style>
    html, body {
      margin: 0;
      padding: 0;
      min-height: 100%;
      background: linear-gradient(to right, #0057b7, #00cfff);
      color: #fff;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .navbar {
      background-color: #0066ec !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    .navbar-brand, .nav-link {
      color: #fff !important;
      font-weight: 600;
      transition: color 0.3s ease;
      margin: 5px;
    }
    .nav-link {
      border: 1px solid #002a5e;
      border-radius: 5px;
      background-color: #002a5e;
    }
    .navbar-brand:hover, .nav-link:hover {
      color: #ffcc00 !important;
    }
    .navbar .dropdown-toggle:hover {
      background-color: #ffcc00 !important;
      color: #002a5e !important;
      transition: 0.3s ease;
    }
    .main-wrapper {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 100px 15px 140px; /* espaçamento para não encobrir o footer */
    }
    .content-container {
      background-color: #002f6c;
      border: #183861 2px solid;
      color: white;
      width: 100%;
      max-width: 800px;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 10px 25px #2b2200;
      text-align: center;
    }
    .content-container h1 {
      color: #ffcc00;
      margin-bottom: 30px;
    }
    .btn-primary {
      background-color:#0066ec;
      color: whitesmoke;
      border: none;
      width: 100%;
      margin-top: 10px;
    }
    .btn-primary:hover {
      background-color: #ad8b00;
      color: #183861;
    }
    footer {
      text-align: center;
      background-color: #002a5e;
      color: rgb(202, 202, 202);
      width: 100%;
      padding: 15px 10px;
    }
    .minha-tabela {
        background-color: #ffcc00 !important; 
        color: #002a5e !important;            
        border: 2px solid white !important;
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 10px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    }
    .minha-tabela th{
    background-color: #ffde5a !important; 
    color: #002a5e !important;
    border: 1px solid white;
    text-align: center;
    font-weight: 600;
    }
    .minha-tabela td{
    background-color: #ffcc00 !important; 
    color: #002a5e !important;
    border: 1px solid white;
    text-align: center;
    font-weight: 600; 
    }
  </style>
</head>
<body>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <a class="navbar-brand d-flex align-items-center" href="/menu">
        Voleibol FIPP
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle btn btn-outline-light fw-semibold px-3 py-2 rounded" href="/menu" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="background-color: #004fc4; border: none;">
              Menu de Cadastros
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="/cadastro-de-time">Cadastro de Equipe/Time</a></li>
              <li><a class="dropdown-item" href="/cadastro-de-jogador">Cadastro de Jogador</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle btn btn-outline-light fw-semibold px-3 py-2 rounded" href="/menu" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="background-color: #004fc4; border: none;">
              Menu de Listas
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="/lista-de-times">Lista de Equipes/Times</a></li>
              <li><a class="dropdown-item" href="/lista_de_jogadores">Lista de Jogadores</a></li>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="/">Login</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/logout">Logout</a>
          </li>
          <li class="nav-item">
            <p class="nav-link mb-0">${req.cookies.ultimoLogin ? "Último Login: " + req.cookies.ultimoLogin : ""}</p>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="main-wrapper">
  <div class="content-container">
    <h1>Lista de Equipe/Time</h1>
    <div class="table-responsive">
      <table class="table minha-tabela">
        <thead>
          <tr>
            <th>Equipe/Time:</th>
            <th>Responsável:</th>
            <th>Telefone:</th>
          </tr>
        </thead>
        <tbody>`;

for(let i = 0; i < lista_de_times.length; i++) {
  conteudo += `
          <tr>
              <td>${lista_de_times[i].time}</td>
              <td>${lista_de_times[i].responsavel}</td>
              <td>${lista_de_times[i].telefone}</td>
          </tr>`;
}

conteudo += `
        </tbody>
      </table>
      <a href="/cadastro-de-time" class="btn btn-primary">Cadastrar Mais</a>
      <a href="/menu" class="btn btn-primary">Retornar ao Menu</a>
    </div>
  </div>
</div>
<footer>
  <p>2025 Voleibol FIPP | Todos os direitos reservados</p>
</footer>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;

res.send(conteudo);
res.end();

});

app.get("/cadastro-de-jogador", verautc, (req, res) => {
 let conteudo = `
 <!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Voleibol Amador</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" />
  <style>
    html, body {
      margin: 0;
      padding: 0;
      min-height: 100%;
      background: linear-gradient(to right, #0057b7, #00cfff);
      color: #fff;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .navbar {
      background-color: #0066ec !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    .navbar-brand, .nav-link {
      color: #fff !important;
      font-weight: 600;
      transition: color 0.3s ease;
      margin: 5px;
    }
    .nav-link {
      border: 1px solid #002a5e;
      border-radius: 5px;
      background-color: #002a5e;
    }
    .navbar-brand:hover, .nav-link:hover {
      color: #ffcc00 !important;
    }
    .navbar .dropdown-toggle:hover {
      background-color: #ffcc00 !important;
      color: #002a5e !important;
      transition: 0.3s ease;
    }
    .main-wrapper {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 100px 15px 140px; 
    }
    .content-container {
      background-color: #002f6c;
      border: #183861 2px solid;
      color: white;
      width: 100%;
      max-width: 800px;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 10px 25px #2b2200;
      text-align: center;
    }
    .content-container h1 {
      color: #ffcc00;
      margin-bottom: 30px;
    }
    .form-label {
      color: #ffcc00;
      font-weight: 500;
    }
    .btn-primary {
      background-color: #ffcc00;
      color: #002f6c;
      border: none;
      width: 100%;
      margin-top: 15px;
    }
    .btn-primary:hover {
      background-color: #ad8b00;
      color: #183861;
    }
    footer {
      text-align: center;
      background-color: #002a5e;
      color: rgb(202, 202, 202);
      width: 100%;
      padding: 15px 10px;
    }
  </style>
</head>
<body>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <a class="navbar-brand d-flex align-items-center" href="/menu">
        Voleibol FIPP
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle btn btn-outline-light fw-semibold px-3 py-2 rounded" href="/menu" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="background-color: #004fc4; border: none;">
              Menu de Cadastros
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="/cadastro-de-time">Cadastro de Equipe/Time</a></li>
              <li><a class="dropdown-item" href="/cadastro-de-jogador">Cadastro de Jogador</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle btn btn-outline-light fw-semibold px-3 py-2 rounded" href="/menu" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="background-color: #004fc4; border: none;">
              Menu de Listas
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="/lista-de-times">Lista de Equipes/Times</a></li>
              <li><a class="dropdown-item" href="/lista_de_jogadores">Lista de Jogadores</a></li>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="/">Login</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/logout">Logout</a>
          </li>
          <li class="nav-item">
            <p class="nav-link mb-0">${req.cookies.ultimoLogin ? "Último Login: " + req.cookies.ultimoLogin : ""}</p>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="main-wrapper">
    <div class="content-container">
      <h1>Cadastrar Jogador</h1>
      <form method="POST" action="/cadastro-de-jogador">
        <div class="mb-3">
          <label for="nome" class="form-label">Nome:</label>
          <input type="text" class="form-control" id="nome" name="nome" />
        </div>
        <div class="mb-3">
          <label for="numero" class="form-label">Numero da Camiseta:</label>
          <input type="number" class="form-control" id="numero" name="numero" />
        </div>
        <div class="mb-3">
          <label for="data" class="form-label">Data de Nascimento:</label>
          <input type="date" class="form-control" id="data" name="data" />
        </div>
        <div class="mb-3">
            <label for="altura" class="form-label">Altura em Centimetros(cm):</label>
            <input type="number" class="form-control" id="altura" name="altura" />
        </div>
        <div class="mb-3">
            <label for="sexo" class="form-label">Sexo:</label>
            <select id="sexo" name="sexo" class="form-select" >
                <option value="">Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
                <option value="prefiro_nao_dizer">Prefiro não dizer</option>
              </select>
        </div>
        <div class="mb-3">
            <label for="posicao" class="form-label">Posição:</label>
            <input type="text" class="form-control" id="posicao" name="posicao" />
          </div>
 `;

 conteudo+=`
 <div class="mb-3">
 <label for="time_do_jogador" class="form-label">Equipe/Time:</label>
 <select id="time_do_jogador" name="time_do_jogador" class="form-select" >
 `;
 if(lista_de_times.length<= 0){
   conteudo+=`
            <option value="">Sem Times Cadastrados</option>
   `;
   
 }else{
  for(let i = 0; i < lista_de_times.length; i++) {
    conteudo+= `
        <option value="${lista_de_times[i].time}">${lista_de_times[i].time}</option>
    `;
  }
  
 }
    
  conteudo+=`
  </select>
    </div>
  <button type="submit" class="btn btn-primary">Cadastrar</button>
      </form>
    </div>
  </div>
  <footer>
    <p>2025 Voleibol FIPP | Todos os direitos reservados</p>
  </footer>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>  
  `;
  res.send(conteudo);
  res.end();
});

app.post("/cadastro-de-jogador", verautc , (req, res) => {
    const nome = req.body.nome;
    const numero = req.body.numero;
    const data = req.body.data;
    const altura = req.body.altura;
    const sexo = req.body.sexo;
    const posicao = req.body.posicao;
    const time_do_jogador = req.body.time_do_jogador;
    let jogadoresNoTime = 0;
    if(nome && numero && data && altura && sexo && posicao && time_do_jogador) {
      for (let i = 0; i < lista_de_jogadores.length; i++) {
        if (lista_de_jogadores[i].time_do_jogador === time_do_jogador) {
            jogadoresNoTime++;
        }}
        if(jogadoresNoTime >= 6){
          let conteudo2 = `
          <!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Time Cheio</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" />
  <style>
    body {
      background: linear-gradient(135deg, #001f3f, #004080);
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      font-family: 'Segoe UI', sans-serif;
      text-align: center;
      padding: 20px;
    }
    .card {
      background-color: #012a4a;
      border: none;
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
      max-width: 500px;
      width: 100%;
    }
    .card h1 {
      color: red;
      font-size: 2rem;
      margin-bottom: 15px;
    }
    .card p {
      color: #ffcc00;
      font-size: 1.2rem;
    }
    .btn-warning {
      margin-top: 20px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Time Cheio!</h1>
    <p>O time <strong>${time_do_jogador}</strong> já possui o limite de <strong>6 jogadores</strong>.</p>
    <a href="/cadastro-de-jogador" class="btn btn-warning">Voltar ao Cadastro</a>
  </div>
</body>
</html>

          `;
          res.send(conteudo2);
          return;
        }
      lista_de_jogadores.push({
        nome: nome,
        numero: numero,
        data: data,
        altura: altura,
        sexo: sexo,
        posicao: posicao,
        time_do_jogador: time_do_jogador
    });
      res.redirect("/lista_de_jogadores");
    } else {
      let conteudo = `
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Voleibol Amador</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" />
        <style>
          html, body {
            margin: 0;
            padding: 0;
            min-height: 100%;
            background: linear-gradient(to right, #0057b7, #00cfff);
            color: #fff;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          .navbar {
            background-color: #0066ec !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          }
          .navbar-brand, .nav-link {
            color: #fff !important;
            font-weight: 600;
            transition: color 0.3s ease;
            margin: 5px;
          }
          .nav-link {
            border: 1px solid #002a5e;
            border-radius: 5px;
            background-color: #002a5e;
          }
          .navbar-brand:hover, .nav-link:hover {
            color: #ffcc00 !important;
          }
          .navbar .dropdown-toggle:hover {
            background-color: #ffcc00 !important;
            color: #002a5e !important;
            transition: 0.3s ease;
          }
          .main-wrapper {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 100px 15px 140px; 
          }
          .content-container {
            background-color: #002f6c;
            border: #183861 2px solid;
            color: white;
            width: 100%;
            max-width: 800px;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 25px #2b2200;
            text-align: center;
          }
          .content-container h1 {
            color: #ffcc00;
            margin-bottom: 30px;
          }
          .form-label {
            color: #ffcc00;
            font-weight: 500;
          }
          .btn-primary {
            background-color: #ffcc00;
            color: #002f6c;
            border: none;
            width: 100%;
            margin-top: 15px;
          }
          .btn-primary:hover {
            background-color: #ad8b00;
            color: #183861;
          }
          footer {
            text-align: center;
            background-color: #002a5e;
            color: rgb(202, 202, 202);
            width: 100%;
            padding: 15px 10px;
          }
          .erro {
            color: rgb(255, 179, 179);
            text-shadow:
              0 0 2px #ff0000,
              0 0 3px #fc0606f5,
              0 0 4px #fa0707de,
              0 0 8px #ff0c0cb6,
              0 0 16px #ff1a1a93,
              0 0 32px #ff33336b,
              0 0 64px #ff4d4d60,
              0 0 128px #ff4d4d21;
          }
        </style>
      </head>
      <body>
        <nav class="navbar navbar-expand-lg">
          <div class="container-fluid">
            <a class="navbar-brand d-flex align-items-center" href="/menu">
              Voleibol FIPP
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav ms-auto">
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle btn btn-outline-light fw-semibold px-3 py-2 rounded" href="/menu" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="background-color: #004fc4; border: none;">
                    Menu de Cadastros
                  </a>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="/cadastro-de-time">Cadastro de Equipe/Time</a></li>
                    <li><a class="dropdown-item" href="/cadastro-de-jogador">Cadastro de Jogador</a></li>
                  </ul>
                </li>
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle btn btn-outline-light fw-semibold px-3 py-2 rounded" href="/menu" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="background-color: #004fc4; border: none;">
                    Menu de Listas
                  </a>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="/lista-de-times">Lista de Equipes/Times</a></li>
                    <li><a class="dropdown-item" href="/lista_de_jogadores">Lista de Jogadores</a></li>
                  </ul>
                </li>
                <li class="nav-item">
                  <a class="nav-link active" href="/">Login</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="/logout">Logout</a>
                </li>
                <li class="nav-item">
                  <p class="nav-link mb-0">${req.cookies.ultimoLogin ? "Último Login: " + req.cookies.ultimoLogin : ""}</p>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div class="main-wrapper">
          <div class="content-container">
            <h1>Cadastrar Jogador</h1>
            <form method="POST" action="/cadastro-de-jogador">
      `;
     if(!nome){
       conteudo+=`
       <div class="mb-3">
          <label for="nome" class="form-label">Nome:</label>
          <input type="text" class="form-control" id="nome" name="nome" />
          <span class="erro">Nome Invalido</span>
        </div>
       `;
     }else{
       conteudo+=`
       <div class="mb-3">
          <label for="nome" class="form-label">Nome:</label>
          <input type="text" class="form-control" id="nome" name="nome" />
        </div>
       `;
     }
     if(!numero){
      conteudo+=`
      <div class="mb-3">
          <label for="numero" class="form-label">Numero da Camiseta:</label>
          <input type="number" class="form-control" id="numero" name="numero" />
          <span class="erro">Numero da camiseta Invalido</span>
        </div>
      `;
    }else{
      conteudo+=`
      <div class="mb-3">
          <label for="numero" class="form-label">Numero da Camiseta:</label>
          <input type="number" class="form-control" id="numero" name="numero" />
        </div>
      `;
    }
    if(!data){
      conteudo+=`
      <div class="mb-3">
          <label for="data" class="form-label">Data de Nascimento:</label>
          <input type="date" class="form-control" id="data" name="data" />
          <span class="erro">Data Invalida</span>
        </div>
      `;
    }else{
      conteudo+=`
      <div class="mb-3">
          <label for="data" class="form-label">Data de Nascimento:</label>
          <input type="date" class="form-control" id="data" name="data" />
        </div>
      `;
    }
    if(!altura){
      conteudo+=`
      <div class="mb-3">
            <label for="altura" class="form-label">Altura em Centimetros(cm):</label>
            <input type="number" class="form-control" id="altura" name="altura" />
            <span class="erro">Altura Invalida</span>
        </div>
      `;
    }else{
      conteudo+=`
      <div class="mb-3">
            <label for="altura" class="form-label">Altura em Centimetros(cm):</label>
            <input type="number" class="form-control" id="altura" name="altura" />
        </div>
      `;
    }
    if(!sexo){
      conteudo+=`
      <div class="mb-3">
            <label for="sexo" class="form-label">Sexo:</label>
            <select id="sexo" name="sexo" class="form-select" >
                <option value="">Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
                <option value="prefiro_nao_dizer">Prefiro não dizer</option>
              </select>
              <span class="erro">Sexo Invalido</span>
        </div>
      `;
    }else{
      conteudo+=`
      <div class="mb-3">
            <label for="sexo" class="form-label">Sexo:</label>
            <select id="sexo" name="sexo" class="form-select" >
                <option value="">Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
                <option value="prefiro_nao_dizer">Prefiro não dizer</option>
              </select>
        </div>
      `;
    }
    if(!posicao){
      conteudo+=`
      <div class="mb-3">
            <label for="posicao" class="form-label">Posição:</label>
            <input type="text" class="form-control" id="posicao" name="posicao" />
            <span class="erro">Posicao Invalida</span>
          </div>
      `;
    }else{
      conteudo+=`
      <div class="mb-3">
            <label for="posicao" class="form-label">Posição:</label>
            <input type="text" class="form-control" id="posicao" name="posicao" />
          </div>
      `;
    }
    if(!time_do_jogador){
      conteudo+=`
      <div class="mb-3">
      <label for="time_do_jogador" class="form-label">Equipe/Time:</label>
      <select id="time_do_jogador" name="time_do_jogador" class="form-select">
      `;
      if(lista_de_times.length<= 0){
        conteudo+=`
                  <option value="">Sem Times Cadastrados</option>
        `;
        
      }else{
        for(let i = 0; i < lista_de_times.length; i++) {
          conteudo+= `
              <option value="${lista_de_times[i].time}">${lista_de_times[i].time}</option>
          `;
        }
      }
      conteudo+=`
      </select>
      <span class="erro">Time Invalido</span>
      </div>
      `;


    }else{
      conteudo+=`
      <div class="mb-3">
      <label for="time_do_jogador" class="form-label">Equipe/Time:</label>
      <select id="time_do_jogador" name="time_do_jogador" class="form-select">
      `;
      if(lista_de_times.length<= 0){
        conteudo+=`
                 <option value="">Sem Times Cadastrados</option>
        `;
        
      }else{
       for(let i = 0; i < lista_de_times.length; i++) {
         conteudo+= `
             <option value="${lista_de_times[i].time}">${lista_de_times[i].time}</option>
         `;
       }
      }
      conteudo+=`
      </select>
      </div>
      `;
    }

    conteudo+=`
    <button type="submit" class="btn btn-primary">Cadastrar</button>
      </form>
    </div>
  </div>
  <footer>
    <p>2025 Voleibol FIPP | Todos os direitos reservados</p>
  </footer>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
    `;
      res.send(conteudo);
      res.end();
      }
  });

  app.get("/lista_de_jogadores", verautc, (req, res) => {
    const timesComJogadores = [];
    
    for (let i = 0; i < lista_de_times.length; i++) {
      const time = lista_de_times[i];
      const jogadoresDoTime = [];
  
      for (let j = 0; j < lista_de_jogadores.length; j++) {
        if (lista_de_jogadores[j].time_do_jogador === time.time) {
          jogadoresDoTime.push(lista_de_jogadores[j]);
        }
      }
  
      timesComJogadores.push({
        nomeTime: time.time,
        info: time,
        jogadores: jogadoresDoTime
      });
    }
  
    let conteudo = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Voleibol Amador</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" />
      <style>
        html, body {
          margin: 0;
          padding: 0;
          min-height: 100%;
          background: linear-gradient(to right, #0057b7, #00cfff);
          color: #fff;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .navbar {
          background-color: #0066ec !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          height: 60px;
        }
        footer {
          height: 60px;
          text-align: center;
          background-color: #002a5e;
          color: rgb(202, 202, 202);
          width: 100%;
          padding: 15px 10px;
        }
        .main-wrapper {
          min-height: calc(100vh - 120px);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 15px;
          width: 100%;
        }
        .content-container {
          background-color: #002f6c;
          border: 2px solid #183861;
          color: white;
          width: 100%;
          max-width: 800px;
          padding: 30px 20px;
          border-radius: 15px;
          box-shadow: 0 10px 25px #2b2200;
          margin: 0 auto;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .navbar-brand, .nav-link {
          color: #fff !important;
          font-weight: 600;
          transition: color 0.3s ease;
          margin: 5px;
        }
        .nav-link {
          border: 1px solid #002a5e;
          border-radius: 5px;
          background-color: #002a5e;
        }
        .navbar-brand:hover, .nav-link:hover {
          color: #ffcc00 !important;
        }
        .navbar .dropdown-toggle:hover {
          background-color: #ffcc00 !important;
          color: #002a5e !important;
          transition: 0.3s ease;
        }
        .content-container h1 {
          text-align: center;
          color: #ffcc00;
          margin-bottom: 30px;
        }
        .btn-primary {
          background-color:#0066ec;
          color: whitesmoke;
          border: none;
          margin-top: 10px;
        }
        .btn-primary:hover {
          background-color: #ad8b00;
          color: #183861;
        }
        .time-card {
          background-color: #ffcc00;
          color: #002a5e;
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .time-header {
          background-color: #ffde5a;
          color: #002a5e;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 15px;
          font-weight: bold;
          text-align: center;
        }
        .table-wrapper {
          display: flex;
          justify-content: center;
          width: 100%;
          margin-bottom: 15px;
          margin-left: auto;
          margin-right: auto;
        }
        .table-responsive {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          max-width: 95%;
          margin: 0 auto;
        }
        .jogador-table {
          width: 100%;
          max-width: 100%;
          background-color: #ffcc00;
          color: #002a5e;
          border-collapse: collapse;
          border-radius: 8px;
          overflow: hidden;
          margin: 0 auto;
        }
        .jogador-table th {
          background-color: #ffde5a;
          color: #002a5e;
          padding: 8px;
          text-align: center;
        }
        .jogador-table td {
          padding: 8px;
          text-align: center;
          border-top: 1px solid #ffde5a;
        }
        .sem-jogadores {
          color: #002a5e;
          font-style: italic;
          padding: 10px;
          text-align: center;
        }
        .buttons-container {
          margin-top: auto;
          padding-top: 20px;
        }
        
        @media (max-width: 576px) {
          .content-container {
            padding: 20px 10px;
          }
          
          .jogador-table {
            font-size: 14px;
          }
          
          .jogador-table th, 
          .jogador-table td {
            padding: 6px 4px;
          }
        }
      </style>
    </head>
    <body>
      <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
          <a class="navbar-brand d-flex align-items-center" href="/menu">Voleibol FIPP</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle btn btn-outline-light fw-semibold px-3 py-2 rounded" href="/menu" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="background-color: #004fc4; border: none;">
                  Menu de Cadastros
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item" href="/cadastro-de-time">Cadastro de Equipe/Time</a></li>
                  <li><a class="dropdown-item" href="/cadastro-de-jogador">Cadastro de Jogador</a></li>
                </ul>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle btn btn-outline-light fw-semibold px-3 py-2 rounded" href="/menu" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="background-color: #004fc4; border: none;">
                  Menu de Listas
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item" href="/lista-de-times">Lista de Equipes/Times</a></li>
                  <li><a class="dropdown-item" href="/lista_de_jogadores">Lista de Jogadores</a></li>
                </ul>
              </li>
              <li class="nav-item"><a class="nav-link active" href="/">Login</a></li>
              <li class="nav-item"><a class="nav-link" href="/logout">Logout</a></li>
              <li class="nav-item">
                <p class="nav-link mb-0">${req.cookies.ultimoLogin ? "Último Login: " + req.cookies.ultimoLogin : ""}</p>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div class="main-wrapper">
        <div class="content-container">
          <h1>Lista de Jogadores por Equipe</h1>
          <div class="content-wrapper">`;
  
    for (let i = 0; i < timesComJogadores.length; i++) {
      const timeInfo = timesComJogadores[i];
  
      conteudo += `
        <div class="time-card">
          <div class="time-header">${timeInfo.nomeTime}</div>
          <div class="table-wrapper">
            <div class="table-responsive">`;
  
      if (timeInfo.jogadores.length > 0) {
        conteudo += `
              <table class="jogador-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Número</th>
                    <th>Posição</th>
                    <th>Nascimento</th>
                    <th>Altura</th>
                    <th>Sexo</th>
                  </tr>
                </thead>
                <tbody>`;
  
        for (let j = 0; j < timeInfo.jogadores.length; j++) {
          const jogador = timeInfo.jogadores[j];
          const data = new Date(jogador.data);
          const dataFormatada = `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;
  
          conteudo += `
                  <tr>
                    <td>${jogador.nome}</td>
                    <td>${jogador.numero}</td>
                    <td>${jogador.posicao}</td>
                    <td>${dataFormatada}</td>
                    <td>${jogador.altura} cm</td>
                    <td>${jogador.sexo}</td>
                  </tr>`;
        }
  
        conteudo += `
                </tbody>
              </table>`;
      } else {
        conteudo += `<div class="sem-jogadores">Nenhum jogador cadastrado para esta equipe.</div>`;
      }
  
      conteudo += `
            </div>
          </div>
        </div>`;
    }
  
    conteudo += `
          </div>
          <div class="buttons-container">
            <div class="d-grid gap-2">
              <a href="/cadastro-de-jogador" class="btn btn-primary">Cadastrar Novo Jogador</a>
              <a href="/menu" class="btn btn-primary">Retornar ao Menu</a>
            </div>
          </div>
        </div>
      </div>

      <footer><p>2025 Voleibol FIPP | Todos os direitos reservados</p></footer>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>`;
  
    res.send(conteudo);
    res.end();
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

const servidor = http.createServer(app);
servidor.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});