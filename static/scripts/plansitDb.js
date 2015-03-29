
var plansItDB = {
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
	AddTrip: function(name, description, departure, length){
		$.ajax({
			type:"Post",
			data:{
				name: name,
				description: description,
				departure: departure,
				length: length
			},
			url: "/trip/add",
			succes: function(data){
			}
		});
	},
	GetTrip: function(tripid){
		$.ajax({
			data:{tripid: tripid},
			url: "/trip/get",
			success:function(data){

			}
		})
	},
	GetUserData: function(){
		$.ajax({
			url:"/user/get",
			success: function(data){
				console.log(data)
			}
		})
	}
}

