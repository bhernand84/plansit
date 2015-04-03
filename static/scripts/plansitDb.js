
var CurrentUser = {};

define(["jquery"], function($){
	return {
		
		AddPlace: function(tripid, placeid, notes,categories){
			if(tripid && placeid){
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
				  		return {};
				  	}
				});	
			}
			else{
				return {error: "Please select a trip and place id."};
			}
		},	
		RemovePlace: function(tripid, ID){
			$.ajax({
				type:"Post",
				data:{ 
					tripid: tripid,
					placeid: ID
				},
				url: "/place/remove",
				success: function(data){

				}
			});
		},
		AddTrip: function(tripName, description, departure, tripLength){
			if(tripName) {
				$.ajax({
					data:{
						"name": tripName,
						"description": description,
						"departure": departure,
						"length": tripLength
					},
					url: "/trip/add",
					success: function(data){
						return {};
					}
				});
			}
			else{
				return {error: "Please name your trip"};
			}
		},
		RemoveTrip: function(tripid){
			$.ajax({
				data:{
					"tripid": tripid
				},
				url: "trip/remove",
				success: function(data){
				}
			});
		},
		GetTrip: function(tripid, callback){
			var Trip;
			$.ajax({
				data:{"tripid": tripid},
				url: "/trip/get",
				dataType:"json",
				success:function(data){
					callback(data);
				}
			});
			return Trip;
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

