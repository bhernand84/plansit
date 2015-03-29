
var CurrentUser;

var plansItDB = {
	LoadUserObject: function(userDBData){
		CurrentUser = userDBData;
	},
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
			success: function(data){
				plansItDB.LoadUserObject(data);
			}
		});
	}
}


