angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    

      .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('menu.home', {
    url: '/home',
    views: {
      'side-menu21': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl'
  })

  .state('sample', {
    url: '/page54',
    templateUrl: 'templates/sample.html',
    controller: 'sampleCtrl'
  })

  .state('menu.pentadbir', {
    url: '/pentadbir',
    views: {
      'side-menu21': {
        templateUrl: 'templates/pentadbir.html',
        controller: 'pentadbirCtrl'
      }
    }
  })

  .state('menu.penyelaras', {
    url: '/penyelaras',
    views: {
      'side-menu21': {
        templateUrl: 'templates/penyelaras.html',
        controller: 'penyelarasCtrl'
      }
    }
  })

  .state('menu.pengurus', {
    url: '/pengurus',
    views: {
      'side-menu21': {
        templateUrl: 'templates/pengurus.html',
        controller: 'pengurusCtrl'
      }
    }
  })

  .state('menu.moderator', {
    url: '/moderator',
    views: {
      'side-menu21': {
        templateUrl: 'templates/moderator.html',
        controller: 'moderatorCtrl'
      }
    }
  })

  .state('ahli', {
    url: '/ahli',
    templateUrl: 'templates/ahli.html',
    controller: 'ahliCtrl'
  })

  .state('pengguna', {
    url: '/pengguna',
    templateUrl: 'templates/pengguna.html',
    controller: 'penggunaCtrl'
  })

  .state('page', {
    url: '/page65',
    templateUrl: 'templates/page.html',
    controller: 'pageCtrl'
  })

  .state('kumpulanUsrah', {
    url: '/usrah',
    templateUrl: 'templates/kumpulanUsrah.html',
    controller: 'kumpulanUsrahCtrl'
  })

  .state('pertemuanUsrah', {
    url: '/page82',
    templateUrl: 'templates/pertemuanUsrah.html',
    controller: 'pertemuanUsrahCtrl'
  })

  .state('topikPerbincangan', {
    url: '/page83',
    templateUrl: 'templates/topikPerbincangan.html',
    controller: 'topikPerbincanganCtrl'
  })

  .state('subtopikPerbincangan', {
    url: '/page84',
    templateUrl: 'templates/subtopikPerbincangan.html',
    controller: 'subtopikPerbincanganCtrl'
  })

  .state('presetTopik', {
    url: '/page85',
    templateUrl: 'templates/presetTopik.html',
    controller: 'presetTopikCtrl'
  })

  .state('presetSubtopik', {
    url: '/page87',
    templateUrl: 'templates/presetSubtopik.html',
    controller: 'presetSubtopikCtrl'
  })

  .state('reset', {
    url: '/page86',
    templateUrl: 'templates/reset.html',
    controller: 'resetCtrl'
  })

$urlRouterProvider.otherwise('/login')


});