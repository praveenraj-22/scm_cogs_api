const fs = require('fs');
const nodemailer = require('nodemailer');



exports.log=function(message,filepath){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();
	var hour    = today.getHours();
	var minute  = today.getMinutes();
	var second  = today.getSeconds();
	if(dd<10)
	{
		dd='0'+dd;
	}

	if(mm<10)
	{
		mm='0'+mm;
	}
	if(hour.toString().length == 1) {
			 hour = '0'+hour;
		}
		if(minute.toString().length == 1) {
			 minute = '0'+minute;
		}
		if(second.toString().length == 1) {
			 second = '0'+second;
		}
	var today1=yyyy+'-'+mm+'-'+dd;
	var dateTime = yyyy+'-'+mm+'-'+dd+' '+hour+':'+minute+':'+second;
	var content=dateTime+" "+message+'\r\n';
	var stream = fs.createWriteStream(filepath, {flags: 'a'});
	stream.write(content);
	stream.end();
}



exports.cronErrEmail=function(argSubject,argMessage){
	var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: 'misreport@dragarwal.com',
	  pass: 'Welcome@##$$'
	}
	});
	let mailOptions={
		from: 'misreport@dragarwal.com',
		to:'nandhakumar.b@dragarwal.com',
		cc:"praveenraj.y@dragarwal.com"
	};
	mailOptions.subject=argSubject;
    mailOptions.text=argMessage;

	//console.log(mailOptions);
	transporter.sendMail(mailOptions, function(error, info){
	if (error) {
		console.log(error);
	} else {
		console.log('Email sent: ' + info.response);
	}
	});
}


exports.cronEmail=function(argTemplate,argEmailDetails,argMailType,argDate,callback){
	//console.log("email sent");
	//console.log(argTemplate);
	//console.log(argEmailDetails[0].fromid);
	console.log(argTemplate);
	console.log(argEmailDetails);
	console.log(argDate);
	console.log(argMailType);

	let varSubject ='';
	let dateArr = argDate.split("-");
	let dateDay = dateArr[2];
    let dateMonth = dateArr[1];
    let dateYear = dateArr[0];
	var monthName = '';
	if(dateMonth==01){
		monthName='Jan';
	}else if(dateMonth==02){
		monthName='Feb';
	}else if(dateMonth==03){
		monthName='March';
	}else if(dateMonth==04){
		monthName='April';
	}else if(dateMonth==05){
		monthName='May';
	}else if(dateMonth==06){
		monthName='June';
	}else if(dateMonth==07){
		monthName='July';
	}else if(dateMonth==08){
		monthName='Aug';
	}else if(dateMonth==09){
		monthName='Sep';
	}else if(dateMonth==10){
		monthName='Oct';
	}else if(dateMonth==11){
		monthName='Nov';
	}else if(dateMonth==12){
		monthName='Dec';
	}

	if(argMailType==1){
		varSubject = 'AVA report - '+dateDay+' '+monthName+' '+dateYear;
	}else if(argMailType==3){
		varSubject = 'AVA report overseas - '+dateDay+' '+monthName+' '+dateYear;
	}else if(argMailType==2){
		varSubject = 'Inactive User Report - '+dateDay+' '+monthName+' '+dateYear;
	}else if(argMailType==4){
		varSubject = 'New OPD for Chennai & Other branches till - '+dateDay+' '+monthName+' '+dateYear;
	}else if(argMailType ==5 ){
varSubject="Branches Collection Report On -"+dateDay+' '+monthName+' '+dateYear;
	}
	else{
		varSubject = 'Revenue vs Cogs Overseas  as on - '+dateDay+' '+monthName+' '+dateYear;
	}
	//console.log(varSubject);

    //console.log(argEmailDetails);
	//process.exit(1);



	var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	   user: argEmailDetails[0].fromid,
	   pass: argEmailDetails[0].passcode
	}
	});
	let mailOptions={
	  from: argEmailDetails[0].fromid,
	  to:argEmailDetails[0].toid,
	  bcc:argEmailDetails[0].bccid,
	  cc:argEmailDetails[0].ccid,
	  subject: varSubject,
	  html: argTemplate
	};
	transporter.sendMail(mailOptions, function(error, info){
	if (error) {
		callback(error,null)
		console.log(error);
	} else {
		callback(null,info.response);
	}
	});

}
