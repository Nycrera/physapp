var physapp = {};

physapp.fetchUserList = function () { // Call as soon as possible, or after load idk
  $.get("adminAPI/listUsers", function (data) {
    if(typeof(data) == 'string') data = JSON.parse(data);
    data.users.forEach((user, index) => {
      if(index < (data.users.length-2)){
        physapp.renderUser(user,'down');
      }else{
        physapp.renderUser(user,'up');
      }
    });
    $('body').preloader('remove');
  })
    .fail(function () {
      alert("Erişim Hatası: İstek Başarısız");
    });
}

physapp.Assign = function(exerciseTypeId, clientId){
  $.ajax({
    type: 'POST',
    url: 'adminAPI/assignExercise',
    data: JSON.stringify({exerciseTypeId: exerciseTypeId, clientId: clientId}),
    success: function(data) { 
      if(typeof(data) === 'string') data = JSON.parse(data);
      $('#listAssignedExercises').append(`<li id="assignedItem${data.user_exercise.id}" class="list-group-item">
      <span class="align-middle">${data.exerciseType.name}
      <button onclick="physapp.unAssign(<%= ${data.user_exercise.id} %>,${clientId})" class="btn btn-danger float-end" type="button">Kaldır</button>
      </span>
      </li>`);
      $('#assignedItem'+data.user_exercise.id).fadeIn();
    },
    fail: function(){
      alert("Erişim Hatası: İstek Başarısız");
    },
    contentType: "application/json",
    dataType: 'json'
});
}


physapp.unAssign = function(exerciseId){
  $.ajax({
    type: 'POST',
    url: 'adminAPI/unAssignExercise',
    data: JSON.stringify({exerciseId: exerciseId}),
    success: function() { 
      $('#assignedItem'+exerciseId).fadeOut();
    },
    fail: function(){
      alert("Erişim Hatası: İstek Başarısız");
    },
    contentType: "application/json",
    dataType: 'json'
});
}


physapp.disableUser = function(id) {
  $.ajax({
    type: 'POST',
    url: 'adminAPI/killUser',
    data: JSON.stringify({id:id,disabled:true}),
    success: function() { 
      $('body').preloader('remove');
      alert('Kullanıcı hesabı kapatıldı.');
      document.referrer ? window.location = document.referrer : history.back()
     },
    fail: function(){
      alert("Erişim Hatası: İstek Başarısız");
    },
    contentType: "application/json",
    dataType: 'json'
});
}

physapp.createExercise = function(name,videoId,cb){
  $.ajax({
    type: 'POST',
    url: 'adminAPI/createExercise',
    data: JSON.stringify({name:name,video:videoId}),
    success: function(data) { 
      if(typeof(data) === 'string') data = JSON.parse(data);
      cb(false,data);
     },
    fail: function(){
      cb(true);
    },
    contentType: "application/json",
    dataType: 'json'
});
}

physapp.updateExercise = function (exerciseId, data, cb){
  $.ajax({
    type: 'POST',
    url: 'adminAPI/updateExercise',
    data: JSON.stringify({id:exerciseId, data : data}),
    success: function() { 
      cb(false);
     },
    fail: function(){
      cb(true);
    },
    contentType: "application/json",
    dataType: 'json'
});
}

physapp.getUserData = function(client_id, month, year,cb){
  $.ajax({
    type: 'POST',
    url: 'adminAPI/fetchUserData',
    data: JSON.stringify({client_id:client_id, month:month, year:year}),
    success: function(data) { 
      if(typeof(data) === 'string') data = JSON.parse(data);
      cb(false,data.user_exercises);
     },
    fail: function(){
      cb(true);
    },
    contentType: "application/json",
    dataType: 'json'
});
}

physapp.uploadVideo = function(name,file,progressBar,cb){
  var data = new FormData();
  data.append('file',file);
  data.append('name',name);
  $.ajax({
    xhr: function() {
        var xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function(evt) {
            if (evt.lengthComputable) {
                var percentComplete = ((evt.loaded / evt.total) * 100);
                progressBar.style.width = percentComplete.toString() + '%';
                progressBar.innerText = percentComplete.toFixed(2).toString() + '%';
            }
        }, false);
        return xhr;
    },
    type: 'POST',
    url: 'adminAPI/upload',
    data: data,
    contentType: false,
    cache: false,
    processData:false,
    beforeSend: function(){
      progressBar.style.width = '0%';
      progressBar.innerText ='0%';
    },
    error:function(){
        cb(true);
    },
    success: function(data){
      cb(false,parseInt(data));
    }
});
}

physapp.createClosableAlert = function(severity,msg,elementId){
  $('#'+elementId).append(`<div class="alert alert-${severity} alert-dismissible fade show" role="alert">
  ${msg}
  <button class="btn-close" type="button" data-coreui-dismiss="alert" aria-label="Close"></button>
</div>`);
}

physapp.renderUser = function (user, barUporDown) {
  var tbody = $('#renderUsers');
  tbody.append(`<tr class="align-middle">
 <td class="text-center">
   <div class="avatar avatar-md"><img class="avatar-img" src="assets/img/avatars/default.jpg">
   <span class="avatar-status bg-success"></span></div>
 </td>
 <td>
   <div>${user.name + ' ' + user.surname}</div>
   <div class="small text-medium-emphasis">Kayıt Tarihi: ${user.register_date}</div>
 </td>
 <td class="text-center">
   ${user.sickness}
 </td>
 <td>
   <div class="clearfix">
     <div class="float-start">
       <div class="fw-semibold">${user.todayProgress}%</div>
     </div>
   </div>
   <div class="progress progress">
     <div class="progress-bar bg-success" role="progressbar" style="width: ${user.todayProgress}%"
       aria-valuenow="${user.todayProgress}" aria-valuemin="0" aria-valuemax="100"></div>
   </div>
 </td>
 <td>
   <div class="small text-medium-emphasis">Giriş</div>
   <div class="fw-semibold">${user.lastlogin}</div>
 </td>
 <td>
   <div class="dropdown ${barUporDown == 'up' ? 'dropup' : ''}">
     <button class="btn btn-transparent p-0" type="button" data-coreui-toggle="dropdown"
       aria-haspopup="true" aria-expanded="false">
       <svg class="icon">
         <use xlink:href="vendors/@coreui/icons/svg/free.svg#cil-options"></use>
       </svg>
     </button>
     <div class="dropdown-menu dropdown-menu-end"><a class="dropdown-item" href="viewprofile?id=${user.id}">Profil</a><a
         class="dropdown-item" href="editUser?id=${user.id}">Düzenle</a><a class="dropdown-item text-danger"
         href="killaccount?id=${user.id}&name=${user.name + ' ' + user.surname}">Hesabı Kapat</a></div>
   </div>
 </td>
</tr>`);
}