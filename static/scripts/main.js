
require(["jquery", "plansitDb"], function($, plansitDb){
	plansitDb.GetUserData();
	$("#placeAdd").submit(function(event){
		event.preventDefault();
		var categories =  [];
        $("input[name='categories']:checked").each(function() {
          categories.push($(this).val());
        });

        var tripID = $("select[name='tripid']",  this).val();
        var placeId = $("input[name='placeid']", this).val();
        var notes = $("input[name='notes']", this).val();

        plansitDb.AddPlace(tripID, placeId, notes, categories);

        ReloadPlacesForTrip(tripID);
	});
	$("#tripAdd").submit(function(event){
		event.preventDefault();
		var name = $("input[name='name']",  this).val();
        var description = $("input[name='description']", this).val();
        var departure = $("input[name='departure']", this).val();
        var triplength = $("input[name='length']", this).val();
        console.log(name);
        plansitDb.AddTrip(name, description, departure, triplength);
        ReloadTrips();
	});
	$(".removePlace").click(function(e){
		e.preventDefault();
		if(confirm("You sure girl?")){
			var id = $(this).attr("data-id");
			var tripid = $(this).parent().parent().attr("data-tripid");
			plansitDb.RemovePlace(tripid, id);
			ReloadPlacesForTrip(tripid);
		}
	});
	$(".removeTrip").click(function(e){
		e.preventDefault();
		if(confirm("You sure girl?")){
			var tripid = $(this).attr("data-id");
			plansitDb.RemoveTrip(tripid);
			ReloadTrips();
		}
	});
});

function ReloadPlacesForTrip(tripid){
	location.reload();
}
function ReloadTrips(){
	location.reload();
}
