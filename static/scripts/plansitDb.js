
var CurrentUser = {};

define(["jquery"], function($){
	return {
		
		AddPlace: function(tripid, placeid, notes,categories){
			$.ajax({
				type: "Post",
				data: {
						tripid: tripid,
						placeid:placeid,
						notes: notes,
						categories: categories
					  },
			  	url: "/place/add",
			  	success: function(data){
			  	}
			});
		},
		DeletePlace: function(tripid, placeid){
			$.ajax({
				type:"Post",
				data:{ 
					tripid: tripid,
					placeid: placeid
				},
				url: "/place/remove",
				success: function(data){

				}
			});
		},
		AddTrip: function(tripName, description, departure, tripLength){
			$.ajax({
				data:{
					"name": tripName,
					"description": description,
					"departure": departure,
					"length": tripLength
				},
				url: "/trip/add",
				success: function(data){
				}
			});
		},
		GetTrip: function(tripid){
			$.ajax({
				data:{"tripid": tripid},
				url: "/trip/get",
				success:function(data){
				}
			});
		},
		GetUserData: function(){
			$.ajax({
				url:"/user/get",
				dataType: "json",
				success: function(data){
					CurrentUser = data;
				}
			});
		}
	}
});

