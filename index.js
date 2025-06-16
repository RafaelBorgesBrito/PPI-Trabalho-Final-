import http from 'http';
import express from "express";
import session from 'express-session';
import cookieParser from 'cookie-parser';

const porta = 3001;
const host = "localhost";
const app = express();
var listaProdutos = [];

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
        res.redirect("/");
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

app.get("/menu", (req, res) => {
    
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
          <a class="navbar-brand d-flex align-items-center" href="#">
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
                      <li><a class="dropdown-item" href="#">Cadastro de Equipe/Time</a></li>
                      <li><a class="dropdown-item" href="#">Cadastro de Jogador</a></li>
                    </ul>
                  </li>
                  <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle btn btn-outline-light fw-semibold px-3 py-2 rounded" href="/menu" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="background-color: #004fc4; border: none;">
                      Menu de Listas
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end">
                      <li><a class="dropdown-item" href="#">Lista de Equipes/Times</a></li>
                      <li><a class="dropdown-item" href="#">Lista de Jogadores</a></li>
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
        <a class="btn btn-warning" href="">Cadastrar Equipe/Time</a>
        <a class="btn btn-warning" href="">Cadastrar Jogador</a>
        <a class="btn btn-warning" href="">Lista de Equipes/Times</a>
        <a class="btn btn-warning" href="">Lista de Jogadores</a>
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

app.get("/logout", (requisicao, resposta) => {
    requisicao.session.destroy();
    resposta.redirect("/login");
});

const servidor = http.createServer(app);
servidor.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});