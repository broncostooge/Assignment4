
var main = function() {
	'use strict';

	$('#addQuestionToDatabase').on('click', function (event) {

		if($('#questionInput').val() !== '') {
			
			var question = $('#questionInput').val();
			var answer = $('#answerInput').val();

			var input = {
				"Question": question,
				"Answer": answer
			};
			
			$.post('question', input, function(res){	
				$('#answer .result').text('Question: ' + res.Question + " Answer: " + res.Answer);
			});
		}
		return false;
	});

	$('#getQuestionFromDatabase').on('click', function (event) {
			
		$.get('question', function(res){	
			$('#answer_Two .result_Two').text('Question: ' + res.Question + " ID: " + res._id);
		});
		return false;
	});

	$('#checkAnswerToQuestionInDatabase').on('click', function (event) {

		if($('#idInput').val() !== '') {
			var ID = $('#idInput').val();
			var answer = $('#answerInputTwo').val();

			var input = {
				"ID": ID,
				"Answer": answer
			};
			
			$.post('answer', input, function(res){	
				$('#answer_Three .result_Three').text('Correct: ' + res.correct);
			});
		}
		return false;
	});

	$('#getScoreFromDatabase').on('click', function (event) {
			
		$.get('score', function(res){	
			$('#answer_Four .result_Four').text('Right: ' + res.right + " Wrong: " + res.wrong);
		});
		return false;
	});
};

$(document).ready(main);