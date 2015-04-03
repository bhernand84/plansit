
require(["jquery", "jquery-ui/jquery-ui", "plansitDb"], function($, ui, plansitDb){
	plansitDb.GetUserData();
	$(function() {
        $( "#accordion" ).accordion({
            collapsible: true,
            heightStyle: "content",
            active: false
        });
    });
	$("#placeAdd").submit(function(event){
		event.preventDefault();
		var categories =  [];
        $("input[name='categories']:checked").each(function() {
          categories.push($(this).val());
        });

        var tripID = $("select[name='tripid']",  this).val();
        var placeId = $("input[name='placeid']", this).val();
        var notes = $("input[name='notes']", this).val();

        var response = plansitDb.AddPlace(tripID, placeId, notes, categories);
        if(response != null && response.error){
        	if(!$(".validation", this).length >0){
	        	$(this).prepend("<div class='validation'></div>");
	        	$(".validation", this).html(response.error);
	        }
    	}
    	else{
	        ReloadPlacesForTrip(tripID);
        }
	});
	$("#tripAdd").submit(function(event){
		event.preventDefault();
		var name = $("input[name='name']",  this).val();
        var description = $("input[name='description']", this).val();
        var departure = $("input[name='departure']", this).val();
        var triplength = $("input[name='length']", this).val();
        var response = plansitDb.AddTrip(name, description, departure, triplength);
        if(response!= null && response.error){
	    	if(!$(".validation", this).length >0){
	        	$(this).prepend("<div class='validation'></div>");
	        	$(".validation", this).html(response.error);
	        }
		}
		else{
	       ReloadTrips();
		}
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
	$(".modalOpen").click(function(e){
		e.preventDefault();
		var dataid = $(this).attr("data-modalid");
		var modal = $(".modal[data-id='" + dataid + "']");
		modal.dialog();
	});
});

function ReloadPlacesForTrip(tripid){
	//location.reload();
}
function ReloadTrips(){
	location.reload();
}
