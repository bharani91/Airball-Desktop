/* --------------------------------------------
 * AirBall v1.0
 * Filename: app.js
 * URL: http://airball.in
 * Author: Bharani Muthukumaraswamy <bharani@abhayam.co.in>
 * Author URL: http://abhayam.co.in
 --------------------------------------------*/


jQuery(document).ready(function($) {

  window.Shot = Backbone.Model.extend();


  // When shot is accessed directly from URL
  window.NewShot = Backbone.Model.extend({
    url_specified: false,
    initialize: function(options)  {
      if(options.id) {
        this.id = options.id;
        this.url_specified = true;
      }
    },

    sync: function(method, model, options) {
      options = options || {};
      options.dataType = "jsonp"; 
      Backbone.sync(method, model, options);
    },

    url: function() {
      return "http://api.dribbble.com/shots/" + this.id;  
    },

  });

  window.Player = Backbone.Model.extend({
    sync: function(method, model, options) {
      options = options || {};
      options.dataType = "jsonp"; 
      Backbone.sync(method, model, options);
    },

    initialize: function (options) {
      this.username = options.username;  
    },

    url: function() {
      return "http://api.dribbble.com/players/" + this.username
    }
  });

  window.PlayerView = Backbone.View.extend({
    className: "shot_detail",
    template: _.template($("#user_profile_template").html()),
    initialize: function()  {
      that = this;
      this.model.fetch({
        success: function(model) {
          that.render();
        }
      });
    },

    render: function()  {
      $(this.el).html(this.template(this.model.toJSON()));
      console.log(this.el);
      $(".main").html(this.el);
    }  
  });


  window.Comment = Backbone.Model.extend({

    initialize: function() {
      this.url = "http://api.dribbble.com/shots/" + this.get("id") + "/comments";
    },

    sync: function(method, model, options) {
      options = options || {};
      options.dataType = "jsonp"; 
      Backbone.sync(method, model, options);
    }  

  });

  window.ShotList = Backbone.Collection.extend({
    model: Shot,
    url: "http://api.dribbble.com/shots/",
    
    parse: function(resp) {
      return resp.shots
    },

    sync: function(method, model, options) {
      options = options || {};
      options.dataType = "jsonp"; 
      Backbone.sync(method, model, options);
    }          

  });

  window.PopularList = ShotList.extend({
    page: 1,
    isLoading: false,
    url: function() {
      return "http://api.dribbble.com/shots/popular?page=" + this.page
    },
    
  });

  window.EveryoneList = ShotList.extend({
    page: 1,
    isLoading: false,
    url: function() {
      return "http://api.dribbble.com/shots/everyone?page=" + this.page
    },

  });

  window.DebutList = ShotList.extend({
    page: 1,
    isLoading: false,
    url: function() {
      return "http://api.dribbble.com/shots/debuts?page=" + this.page
    },

  });

  window.PlayerList = ShotList.extend({
    page: 1,
    isLoading: false,
    initialize: function(options) {
      this.username = options.username;
    },
    url: function() {
      console.log(this.username);
      return "http://api.dribbble.com/players/" + this.username + "/shots?page=" + this.page;
    },
  });


  window.ShotView = Backbone.View.extend({
    tagName: "li",
    className: "item",
    
    template: _.template($('#shot_template').html()),

    render:function () {
      $(this.el).html(this.template(this.model.toJSON())) ;
      return this;
    },
  });

  window.ShotContainerView = Backbone.View.extend({
    tagName: "ul",
    className: "post_list clearfix",


    initialize: function()  {
      $(".sidebar").bind("scroll", {el: this}, this.checkScroll);
      this.collection.on("reset", this.render, this);
      // this.collection.on("reset", this.preload, this.collection);
    },

    preload: function(shots) {

      console.log("preloading");
      _.each(shots.models, function(shot,i) {
        $("<img />").attr("src", shot.get("image_url"));
      });
    },

    render: function()  {
      console.log("Rendering");
      _.each(this.collection.models, function (post) {
        $(this.el).append(new ShotView({ model: post }).render().el);
      }, this);     
      return this;
    },

    loadResults: function () {
      that = this;
      this.collection.isLoading = true;
      this.collection.fetch({ 
        add: true, // append to collection instead of replacing

        success: function (shots) {
          $(that.el).empty();
          console.log($(that.el));
          // _.each(shots.models, function (post) {
          //   $(that.el).append(new ShotView({ model: post }).render().el);
          // }, that);      
          // $(that.el).append(this.el);
          that.render();
          shots.isLoading = false;
          console.log(shots.isLoading);
        }
      });      
      
      // this.preload(this.collection);
    },


    checkScroll: function(event) {
      var triggerPoint = 200; 
      that = event.data.el;
      // console.log("lhs", $(".sidebar").scrollTop() + $(".sidebar").height() + triggerPoint);
      // console.log("rhs", $(".post_list").height());
      if( !that.collection.isLoading && ($(".sidebar").scrollTop() + $(".sidebar").height() + triggerPoint > $(".post_list").height()) ) {
        that.collection.page += 1; // Load next page
        console.log("loading");
        that.loadResults();
      }
    }
  });

  window.ShotDetailView = Backbone.View.extend({
    className: "shot_detail",
    template: _.template($("#shot_detail_template").html()),
    render: function()  {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    }
  });

  window.Comment = Backbone.Model.extend();

  window.CommentsList = Backbone.Collection.extend({  
    model: Comment,
    initialize: function(options) {
      this.id = options.id;
    },

    url: function() {
      console.log(this.id)
      return "http://api.dribbble.com/shots/" + this.id + "/comments";
    },

    parse: function(resp) {
      return resp.comments
    },
    
    sync: function(method, model, options) {
      options = options || {};
      options.dataType = "jsonp"; 
      Backbone.sync(method, model, options);
    }

  });

  window.CommentListView = Backbone.View.extend({
    tagName: "ul",
    className: "comment_list",

    initialize: function()  {
      that = this
      this.collection.fetch({
        success: function() {
          that.render();
        }
      });
    },

    render: function()  {
      that = this;
      if(this.collection.length > 0) {
        _.each(this.collection.models, function(comment) {
          $(that.el).append(new CommentView({ model: comment }).render().el);
        });  
      } else {
        $(that.el).append("<li><h3>No comments yet!</h3></li>");
      }
      
      
      $(".main").append(this.el).append('<div class="save_local credits"><h3>Looking to get a website or application built? <a href="mailto:bharani@abhayam.co.in" class="button" target="_blank" title="Get in touch!">Get in touch!</a></h3></div>');
    }

  });


  window.CommentView = Backbone.View.extend({
    tagName: "li",
    className: "comment",
    template: _.template($("#shot_comment_template").html()),

    render: function()  {
      $(this.el).html(this.template(this.model.toJSON())) ;
      return this;
    }
  })


  // Router
  var AppRouter = Backbone.Router.extend({
    routes:{
        ""            :       "home",
        "everyone"    :       "everyone",
        "debut"       :       "debut",
        "shot/:id"    :       "showShot",
        "player/:id"  :       "showPlayer",
        "local_shots" :       "localShots"
    },

    // preload: function(collection)  {
    //   console.log("preloading 2")
    //   _.each(collection.models, function(model) {
    //     var img = $("<img />").attr("src", model.get("image_url"));
    //   });
    // },

    initialize: function()  {
      console.log("Initializing")
      this.popular_list = new PopularList();
      that = this;

      this.popular_list.fetch({
        success: function(collection) {
          // setTimeout(function() { that.preload(collection) }, 10*1000);
        }
      });

      this.everyone_list = new EveryoneList();
      this.everyone_list.fetch({
        success: function(collection) {
          // setTimeout(function() { that.preload(collection) }, 20*1000);
        }
      });
      

      
      this.debut_list = new DebutList();
      this.debut_list.fetch({
        success: function(collection) {
          // setTimeout(function() { that.preload(collection) }, 30*1000);
        }
      });
      
    },
    
    refresh: function(list) {
      if(list == "") {
        var that = this,
            popular_list = new PopularList();
        popular_list.fetch({
          success: function(collection) {
            that.popular_container_view = new ShotContainerView({ collection: collection });
            $('.post_list_container').empty().prepend(that.popular_container_view.render().el);   
          }
        });
        
        console.log(popular_list);

      } else if(list == "everyone") {
        var that = this,
            everyone_list = new EveryoneList();
        everyone_list.fetch({
          success: function(collection) {
            that.everyone_container_view = new ShotContainerView({ collection: collection });
            $('.post_list_container').empty().prepend(that.everyone_container_view.render().el);   
          }
        });
        console.log(everyone_list);

      } else if(list == "debut") {
        var that = this,
            debut_list = new DebutList();
        debut_list.fetch({
          success: function(collection) {
            that.debut_container_view = new ShotContainerView({ collection: collection });
            $('.post_list_container').empty().prepend(that.debut_container_view.render().el);    
          }
        });
        console.log(debut_list);
      }
    },
    
 
    home: function () {
      $('#list_footer').show();
      $(".sidebar").scrollTop(0);
      $(".sidebar header").find(".active").removeClass("active");
      $(".sidebar header").find(".popular").addClass("active");
      $(".main").html('<img src="public/images/main_image.png" alt="Dribbble" class="main_image">');
      this.popular_container_view = new ShotContainerView({ collection: this.popular_list });
      $('.post_list_container').empty().prepend(this.popular_container_view.render().el); 

    },

    everyone: function () {
      $('#list_footer').show();
      $(".sidebar").scrollTop(0);
      $(".sidebar header").find(".active").removeClass("active");
      $(".sidebar header").find(".everyone").addClass("active");
      $(".main").html('<img src="public/images/main_image.png" alt="Dribbble" class="main_image">');
      this.everyone_container_view = new ShotContainerView({ collection: this.everyone_list });
      $('.post_list_container').empty().prepend(this.everyone_container_view.render().el); 
    },

    debut: function () {
      $('#list_footer').show();
      $(".sidebar").scrollTop(0);
      $(".sidebar header").find(".active").removeClass("active");
      $(".sidebar header").find(".debut").addClass("active");
      $(".main").html('<img src="public/images/main_image.png" alt="Dribbble" class="main_image">');
      this.debut_container_view = new ShotContainerView({ collection: this.debut_list });
      $('.post_list_container').empty().prepend(this.debut_container_view.render().el); 

    },

    showShot: function(item)  {
      $('#list_footer').hide();
      var selected_model = (this.popular_list && this.popular_list.get({id: item}) || this.everyone_list.get({id: item}) || this.debut_list.get({id: item}))
      if (!selected_model) {
        model = new NewShot({id: item});  
        model.fetch({
          success: function(m) {
            this.shot_detail_view = new ShotDetailView({ model: m });
            $('.main').html(this.shot_detail_view.render().el);   
          }
        })
        
      } else {
        this.shot_detail_view = new ShotDetailView({ model: selected_model });
        $('.main').html(this.shot_detail_view.render().el);  
        
        if(db.valid_shot(selected_model.get("title"))) {
          $(".save_local").show();
        } else {
          $(".save_local").hide();
        } 
      }
      

      
      var comments_list = new CommentsList({ id: item });
      this.comments_view = new CommentListView({ collection: comments_list });
      
    },

    showPlayer: function(id) {
      console.log(id);
      var player = new Player({ username: id });
      var player_view = new PlayerView({ model: player });
      $('#list_footer').hide();

      this.player_list = new PlayerList({ username: id });
      console.log(this.player_list);
      this.player_list.fetch({
        add: true,
        success: function(collection) {
          var first = collection.at(0);
          if (!first.attributes.image_url) {
            first.destroy();
          };
          this.player_container_view = new ShotContainerView({ collection: collection });  

          $('.post_list_container').html(this.player_container_view.render().el);
          $(".sidebar").scrollTop(0);
          $(".post_list_container").prepend("<h3 class='showing_shots'>Showing shots by <span>" + player.get("name") + "</span></h3>");
        }
      });

      
    },

        

      // console.log(this.player_container_view.render().el);
      // $('.post_list_container').html(this.player_container_view.render().el);  
     

  });
   
  window.app = new AppRouter();
  Backbone.history.start();



});