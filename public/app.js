
var main = function() {
	'use strict';

	$('#addQuestionToDatabase').on('click', function (event) {

		if($('#questionInput').val() !== '') {
			
			var question = $('#questionInput').val();
			var answer = $('#answerInput').val();

			$.ajax({
			  type: "POST",
			  url: 'question',
			  data: JSON.stringify({
			  	"Question": question,
			  	"Answer": answer
			  }),
			  success: function(res){	
				$('#answer .result').text('Question: ' + res.Question + " Answer: " + res.Answer);
				},
				contentType: "application/json",
    			dataType: 'json'
			});
		}
		return false;
	});

	$('#getQuestionFromDatabase').on('click', function (event) {
			
		$.get('question', function(res){	
			if(res.length == 0){
				$('#answer_Two .result_Two').text('Database is Empty!');
			}
			else{
				$('#answer_Two .result_Two').text('Question: ' + res.Question + " ID: " + res._id);
			}
		});
		return false;
	});

	$('#checkAnswerToQuestionInDatabase').on('click', function (event) {

		if($('#idInput').val() !== '') {
			var ID = $('#idInput').val();
			var answer = $('#answerInputTwo').val();
			
			$.ajax({
			  type: "POST",
			  url: 'answer',
			  data: JSON.stringify({
			  	"ID": ID,
			  	"Answer": answer
			  	}),
			  success: function(res){	
				$('#answer_Three .result_Three').text('Correct: ' + res.correct);
				},
			  contentType: "application/json",
    		  dataType: 'json'
			});
		}
		return false;
	});

	$('#getScoreFromDatabase').on('click', function (event) {
			
		$.get('score', function(res){	
			if(res.length == 0){
				$('#answer_Four .result_Two').text('Database is Empty!');
			}
			else{
				$('#answer_Four .result_Four').text('Right: ' + res.right + " Wrong: " + res.wrong);
			}
		});
		return false;
	});
};

$(document).ready(main);