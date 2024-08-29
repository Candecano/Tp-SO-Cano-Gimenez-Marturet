var questions = [
    {
        question: "1. ¿Qué tipo de sistema operativo es utilizado comúnmente en computadoras grandes que procesan grandes cantidades de datos?",
        options: [
            "Sistema operativo de computadoras personales",
            "Sistema operativo de tarjetas inteligentes",
            "Sistema operativo de mainframe",
            "Sistema Operativo Integrado"
        ],
        correctAnswer: 2
    },
    {
        question: "2. ¿Cuál de los siguientes sistemas operativos es conocido por ser de código abierto y permite la modificación y distribución libre?",
        options: [
            "Android",
            "Linux",
            "iOS",
            "Windows"
        ],
        correctAnswer: 1
    },
    {
        question: "3. ¿Qué tipo de sistema operativo se utiliza en dispositivos como microondas y televisores?",
        options: [
            "Sistema operativo integrado",
            "Sistema operativo de computadoras personales",
            "Sistema operativo de nodos sensores",
            "Ninguno de los anteriores"
        ],
        correctAnswer: 0
    },
    {
        question: "4. ¿Qué tipo de sistema operativo se utiliza en dispositivos como tarjetas de crédito y SIM?",
        options: [
            "Sistema operativo de computadoras de bolsillo",
            "Sistema operativo de multiprocesadores",
            "Sistema operativo de tarjetas inteligentes",
            "Todas son correctas"
        ],
        correctAnswer: 2
    },
    {
        question: "5. ¿Qué tipo de sistema operativo es comúnmente utilizado en dispositivos móviles como smartphones y tablets?",
        options: [
            "Sistemas operativos de servidores",
            "Sistemas operativos de nodos sensores",
            "Sistemas operativos de móviles personales",
            "Sistemas operativos de computadoras personales"
        ],
        correctAnswer: 2
    }
];

// Aquí utilizamos UnderscoreJS para generar un template de pregunta.
var questionTemplate = _.template(" \
	<div class='card question'><span class='question'><%= question %></span> \
      <ul class='options'> \
        <% _.each(options, function(option, index) { %> \
          <li> \
            <input type='radio' name='question[<%= i %>]' value='<%= index %>' id='q<%= i %>o<%= index+1 %>'> \
            <label for='q<%= i %>o<%= index+1 %>'><%= option %></label> \
          </li> \
        <% }); %> \
      </ul> \
    </div> \
    ");

// Definimos las variables de estado del juego y los valores iniciales (como el tiempo de respuesta de cada pregunta).
var points,
    pointsPerQuestion,
    currentQuestion,
    questionTimer,
    timeForQuestion = 300, // segundos
    timeLeftForQuestion; 

// Manipulación de elementos con jQuery.
$(function() {

    // Uso de jQuery para escuchar el evento click del botón de Comenzar y Volver a jugar.
    $('button.start').click(start);
    $('.play_again button').click(restart);

    // La función restart inicializa los valores de las variables de estado del juego.
    function restart() {
        points = 0;
        pointsPerQuestion = 10;
        currentQuestion = 0;
        timeLeftForQuestion = timeForQuestion;
        // Se oculta la pantalla de finalizar y un mensaje que dice "Se acabó el tiempo".
        $('.finish.card').hide();
        $('div.start').show();
        $('.times_up').hide();

        generateCards();
        updateTime();
        updatePoints();
    }

    // La función start se ejecuta cuando el jugador hace click en comenzar.
    function start() {
        $('div.start').fadeOut(200, function() {
            moveToNextQuestion();
        });
    }

    // Esta es una de las funciones clave del juego, encargada de generar las preguntas.
    function generateCards() {
        $('.questions').html('');
        for (var i = 0; i < questions.length; i++) {
            var q = questions[i];
            var html = questionTemplate({
                question: q.question,
                options: q.options,
                i: i
            });
            $('.questions').append(html);
        };

        // Indicamos que nos interesa el evento change de los inputs dentro de los elementos con clase question y card (cada una de las preguntas).
        $('.question.card input').change(optionSelected);
    }

    // Esta función cambia el estado del juego para pasar de una pregunta a la siguiente.
    function moveToNextQuestion() {
        currentQuestion += 1;
        if (currentQuestion > 1) {
            $('.question.card:nth-child(' + (currentQuestion-1) + ')').hide();
        }

        // Se muestra la siguiente pregunta.
        showQuestionCardAtIndex(currentQuestion);
        setupQuestionTimer();
    }

    // Esta función inicializa el temporizador para responder una pregunta.
    function setupQuestionTimer() {
        if (currentQuestion > 1) {
            clearTimeout(questionTimer);
        }
        timeLeftForQuestion = timeForQuestion;

        // Cada 1 segundo, nuestro temporizador llamará a la función countdownTick().
        questionTimer = setTimeout(countdownTick, 1000);
    }

    // Mostramos la tarjeta de pregunta correspondiente al índice que la función recibe por parámetro.
    function showQuestionCardAtIndex(index) { // starting at 1
        var $card = $('.question.card:nth-child(' + index + ')').show();
    }

    // La función countdownTick() se ejecuta cada un segundo, y actualiza el tiempo restante para responder en la pantalla del jugador.
    function countdownTick() {
        timeLeftForQuestion -= 1;
        updateTime();
        if (timeLeftForQuestion == 0) { 
            return finish();
        }
        questionTimer = setTimeout(countdownTick, 1000);
    }

    // Actualiza el tiempo restante en pantalla, utilizando la función html().
    function updateTime() {
        $('.countdown .time_left').html(timeLeftForQuestion + 's');
    }

    // Actualiza los puntos en pantalla.
    function updatePoints() {
        $('.points span.points').html(points + ' puntos');
    }

    // Esta función se ejecuta cuando el jugador escoge una respuesta.
    function optionSelected() {
        var selected = parseInt(this.value);
        var correct = questions[currentQuestion-1].correctAnswer;

        if (selected == correct) {
            points += pointsPerQuestion;
            updatePoints();
            correctAnimation();
        } else {
            wrongAnimation();
        }

        if (currentQuestion == questions.length) {
            clearTimeout(questionTimer);
            return finish();
        }
        moveToNextQuestion();
    }

    // Animación de respuesta correcta e incorrecta.
    function correctAnimation() {
        animatePoints('right');
    }

    // Animación de respuesta correcta e incorrecta.
    function wrongAnimation() {
        animatePoints('wrong');
    }

    // Esta función anima el puntaje en pantalla.
    function animatePoints(cls) {
        $('header .points').addClass('animate ' + cls);
        setTimeout(function() {
            $('header .points').removeClass('animate ' + cls);
        }, 500);
    }

    // Cuando el juego termina, esta función es ejecutada.
    function finish() {
        if (timeLeftForQuestion == 0) {
            $('.times_up').show();
        }
        $('p.final_points').html(points + ' puntos');
        $('.question.card:visible').hide();
        $('.finish.card').show();
    }

    // Inicializamos el juego.
    restart();

});
