var nonce = '';
$(document).ready(function(){
	$('#ajaxtest').on('click',function(){
		Ajax.get('test',{
			name:$('#ajaxtext').val()
		},function(data) {
			$('#response').html(data);
		});
	});
}); 