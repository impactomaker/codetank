Class.subclass('Overlay', {
  
  init: function() {
    this.bgNode = $('#overlay');
    this.contentNode = $('#overlay-contents'); 
  },
  
  display: function(html, stack) {
    this.contentNode.html(html);
    this.show();
  },
  
  show: function() {
    this.bgNode.show();
    this.contentNode.show();
  },
  
  hide: function() {
    this.contentNode.hide();
    this.bgNode.hide();
  },
  
  displayPage: function(name) {
    var builder = new OverlayBuilder();
    Overlay.PAGES[name].call(this, builder);
    var html = builder.render();
    this.display(html);
  }
  
});

Class.subclass('OverlayBuilder', {
  
  init: function() {
    this.buffer = '';
  },
  
  render: function() {
    return this.buffer;
  },
  
  h1: function(txt) {
    return this.html("<h1>" + txt + "</h1>\n");
  },
  
  p: function(txt) {
    return this.html("<p>" + txt + "</p>\n");
  },
  
  indent: function(txt) {
    return this.html('<p style="margin-left:20px;">' + txt + '</p>');
  },

  text: function(name, value) {
    var html = '<input type="text" id="'+name+'" name="'+name+'"';
    if (value) { html += ' value="' + value + '"'; }
    html += '></input>';
    return this.html(html);
  },
  
  button: function(name, onclick, icon) {
    return this.html('<button onclick="'+onclick+'">'+name+'</button>');
  },
  
  html: function(txt) {
    this.buffer += txt;
    return this; 
  }
  
});

Overlay.PAGES = {
  'enter-name': function(p) {
    var saveCmd = "app.settings.set('name', $('#name').val());app.overlay.displayPage('welcome');";
    
    p.h1('Bem vindo ao Impacto Maker - Code Commander')
      .p('Insira seu nome para começar seus testes:')
      .text('name')
      .p('Clique em "Salvar" quando terminar.')
      .button('Salvar', saveCmd);
  },
  
  'welcome': function(p) {
    p.h1('Seja bem vindo(a) ' + app.settings.get('name') + '!')
      .p('Neste jogo, você vai comandar um tanque robô que deve destruir a base inimiga. Mas para fazer isso você deverá escrever um programa com os comandos necessários para se mover e disparar a cada nível. Você poder usar os seguinte comandos:')
      .indent('<b>move | left | right | fire | wait</b>')
      .p('Que são: mover, esquerda, direita, disparar, esperar.')
      .p('Depois de ter escrito o seu programa, clique no botão "Executar programa" para ver se funciona!')
      .p('<b>Os níveis introdutórios são somente para diversão porém os nívels que estão em "Beginner" podem garantir a você um desconto na colônia de férias!</b>')
      .p('<b>Clique no botão "Selecionar Nível" e complete os desafios em "Beginner". Também não esqueça de ler as regras para validar o desafio.</b>')
      .button('Selecionar Nível', "app.overlay.displayPage('select-level');");
  },
  
  'select-level': function(p) {
    var diffs = Level.difficulties();
    var levels = '<table class="indent">';
    for (var d = 0; d < diffs.length; d++) {
      var diff = diffs[d];
      var count = Level.levelCount(diff);
      levels += '<tr>';
      levels += '<td style="vertical-align: middle;width: 100px;">' + diff.toUpperCase() + '</td>';
      levels += '<td>';
      for (var num = 0; num < count; num++) {
        var klass = 'level';
        if (Level.isCompleted(Level.key(diff, num))) {
          klass += ' completed'; 
        }
        levels += '<div class="'+klass+'" onclick="app.loadLevel(\''+diff+'\', '+num+')">' + (num + 1) + '</div>'; 
      }
      levels += '</td>';
      levels += '</tr>'; 
    }
    levels += '</table>';
    
    p.h1('Selecione um nível')
      .p('Usuario: ' + app.settings.get('name'))
      .p('Clique em um nível para começar')
      .html(levels)
      .p('<i>Números mais altos são mais difíceis</i>');
  },
  
  'win': function(p) {
    p.h1('Você venceu!!!')
      .p('Parabéns! Vamos ver se você vence o próximo...')
      .button('Próximo nível', "app.overlay.displayPage('select-level');");
  },
  
  'lose': function(p) {
    p.h1('Tente Novamente')
      .p('Você não destruiu a base, continue trabalhando no seu programa e tente novamente!')
      .button('Tentar novamente', 'app.resetLevel()')
      .button('Selecionar o nível', "app.overlay.displayPage('select-level');");
  },
  
  'help-programming': function(p) {
    p.h1('Ajuda do Code Commander')
      .p('Para programar seu tanque, você deve inserir uma série de comandos, um por linha, na caixa "Console" à direita da tela.')
      .p('Você pode escolher entre os seguintes comandos:')
      .indent('<b>move</b>: move o tanque para frente um quadrado')
      .indent('<b>right</b>: vire à direita 90 graus')
      .indent('<b>left</b>: vire à esquerda 90 graus')
      .indent('<b>wait</b>: espere uma vez')
      .indent('<b>fire</b>: disparar sua arma - a bala vai viajar até atingir algo')
      .p('Os comandos podem ser repetidos várias vezes adicionando uma contagem como parâmentro assim:  <b>move(3)</b>')
      .p('Para mais informações, <a target="_blank" href="https://github.com/impactomaker/impactomaker.github.io">Clique Aqui</a> e leia o README do jogo. :)')
      .button('Fechar', "app.overlay.hide();");
  },
  
  'about': function(p) {
    p.h1('Sobre o Code Commander')
      .p('This program is the personal project of Rob Morris of <a href="http://irongaze.com" target="_blank">Irongaze Consulting</a>.')
      .p('It is written in pure Javascript, using <a href="http://jquery.com" target="_blank">jQuery</a>, <a href="http://craftyjs.com" target="_blank">CraftyJS</a> ' +
         'and <a href="http://schillmania.com/projects/soundmanager2/" target="_blank">SoundManager 2</a>.')
      .p('Source code for the project is hosted on <a href="https://github.com/irongaze/Code-Commander" target="_blank">GitHub</a>, and is licensed under the MIT license.')
      .p('Sprites, fonts, icons, sounds and music (where not originally created) have been sourced from numerous generous contributors, and are all free for commercial use in one form or another.')
      .p('Questions, comments or suggestions may be directed to <a href="mailto:codecommander@irongaze.com">codecommander@irongaze.com</a>.')
      .button('Close', "app.overlay.hide();");
  }
}
