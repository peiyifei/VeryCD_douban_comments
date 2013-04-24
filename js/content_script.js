var Steal = Class.extend({
	init: function() {
		if (document.location.pathname.match(/\/entries\/(\d+)\/$/) == null) {
			return;
		}
		var movie_name = $('#location_div a').eq(2).html();
		this.search_movie(movie_name);
	},
	search_movie: function(movie_name) {
		var _self = this;
		$.ajax({
	         url: 'http://movie.douban.com/subject_search?search_text=' + movie_name + '&cat=1002',
	         type: "get",
	         dataType: "html",
	         success: function(rs) {
	         	var _zdb = $('<div></div>');
	            var _guess_result = _zdb.html(rs).find('div.article table').eq(0);
	            if (_guess_result == null) {
	            	return;
	            }
	            var _data = {};
				_data.movie_name = _guess_result.find('img').attr('alt');
            	_data.movie_url = _guess_result.find('a').attr('href') + 'comments?limit=50&sort=new_score';
            	_data.movie_score = _guess_result.find('.rating_nums').html();
            	_data.comment_list = [];
            	$.get(_data.movie_url, function(response){
        			var _d_comments = $('<div></div>');
        			_d_comments.html(response).find('.mod-bd .subject-comment-item').each(function(){
        				var _this = $(this);
        				var _comment = {};
        				_comment.username = _this.find('.avatar a').attr('title');
        				_comment.useravatar = _this.find('.avatar img').attr('src');
        				_comment.score = _this.find('.comment-info .rating').attr('title');
        				_comment.contents = _this.find('.comment p').html();
        				_comment.vote = _this.find('.comment span.votes').html();
        				_this.find('.comment-info a').remove().html();
        				_this.find('.comment-info span').remove();
        				_comment.create_time = _this.find('.comment-info').html();
        				_data.comment_list.push(_comment);
        			});
        			_d_comments.remove();
        			_zdb.remove();
        			_self.put_comments(_data);
            	});
	         }
	    });
	},
	put_comments: function(data) {
		var comment_list = $('<div class="mod-bd" style="border: 2px solid #e6e6e6;margin-bottom:10px;"></div>');
		var _comment = '';
		for (var i = 0;i < data.comment_list.length;i++) {
			_comment += '<div class="subject-comment-item" style="display:none;"><div class="avatar"><a title="naoko" href="javascript:;"><img src="' + data.comment_list[i].useravatar + '"></a></div><div class="comment"><h3><span class="comment-vote"><span class="votes pr5">' + data.comment_list[i].vote + '有用</span></span><span class="comment-info"><a href="javascript:;">' + data.comment_list[i].username + '</a> ' + data.comment_list[i].score + ' '+ data.comment_list[i].create_time + '</span></h3><p>'+ data.comment_list[i].contents +'</p></div></div>';
		}
		var _title_line = '<div class="title_line clearfix color_gray"><span class="fleft">以下评论来自<a target="_blank" href="'+data.movie_url+'" class="red">豆瓣</a>  匹配有时不精准，可点去豆瓣查看</span><span style="float:right;" id="db_btn">展开</span></div>';
		comment_list.append(_title_line + _comment);
		$('#entry_tabs .content_box_wrap').eq(0).after(comment_list);
		$('#db_btn').click(function(){
			if ($(this).html() == '展开') {
				$(this).html('收起');
			} else {
				$(this).html('展开');
			}
			$('.subject-comment-item').toggle();
		});
	}
});

steal = new Steal();
