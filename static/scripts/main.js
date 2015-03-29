require(["jquery", "plansitDb"], function($, plansitDb){
	plansitDb.GetUserData();
	$("form").submit(function(event){
		event.preventDefault();
		$.ajax({
			url: $(this).attr('action'),
			data: $(this).serialize()
		});
		location.reload();
	});
});
