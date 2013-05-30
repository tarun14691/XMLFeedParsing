function getFeedData(feedName)
{
	var feedFilePath = '';
	if(feedName == undefined){
		feedFilePath = 'data/feed1.xml';
		$('#feedIdVal').val('feed1');
	}else{
		feedFilePath = 'data/'+feedName+'.xml';
		$('#feedIdVal').val(feedName);
	}
	
	$.ajax({                                      
		url: feedFilePath, 
		dataType: "xml",
		beforeSend: function() {
			$('#'+feedName+'').html('Loading...');
		},
		success: function(xml)
		{
			$('#'+feedName+'').html('');
			$('.prevIssueButton').prop('disabled',true);
			$('.nextIssueButton').prop('disabled',false);
			
			var startIndex = 0; // starting index of feed .
			var feedsPerPage = 4; // constant of how many per page.
			var $items = $(xml).find('item'); //the resulting items from the xml
			var totalItems = $items.length;
			var numPages = Math.ceil(totalItems / feedsPerPage);
			var feedId = $('#feedIdVal').val();
			var displayFeeds = function() { 
				  // display the feeds
				var $feedsPaginated = $items.slice( startIndex , feedsPerPage + startIndex );
				$('.feedItemsDiv').fadeOut(500).remove(); // clear old items
				var feedsOnPage = (startIndex / feedsPerPage)+1 ;
				$('.feedsRatio').html(feedsOnPage + '/' + numPages);
				//$('#feedsRatio1').html(feedsOnPage + '/' + numPages);
				$feedsPaginated.each(function(){
					var heading = $(this).find('heading').text();
					var content = $(this).find('content').text();
					var image = $(this).find('image').text();
					var url = $(this).find('url').text();
					$('<div class="feedItemsDiv"></div>').html('<span class="feedImg"><img src="img/'+image+'" alt="feed Image" /></span><span class="feedData"><h4 style="padding-top: 1%;">'+heading+'</h4><p style="margin-top: -2%; padding-bottom: 1%;">'+content+'</p></span>').fadeIn(500).appendTo('#'+feedId+'');
				});
			}
			$('.prevIssueButton').click(function() {
				if( startIndex < totalItems) {
					startIndex -= numPages;
					if($('#nextIssueButton').prop('disabled',true))
						$('.nextIssueButton').prop('disabled',false);
					if(startIndex < 0){
						startIndex += numPages;
						$('.prevIssueButton').prop('disabled',true);
					}else{
						displayFeeds();
					}
				}else {
					alert('No more previous issues'); // probably want to do something more elegant here, like start over at 0, etc..
				}
			});
			$('.nextIssueButton').click(function(){
				if( startIndex + numPages <= totalItems) {
					startIndex += numPages;
					$('.prevIssueButton').prop('disabled',false);
					$('.nextIssueButton').prop('disabled',false);
					displayFeeds();
				}else{
					$('.nextIssueButton').prop('disabled',true);
				}
			});
			displayFeeds();
		},
		error: function (xml) 
		{
			console.log(xml);
		}
	});
}
$(document).ready(function(){
	getFeedData();
	$('.content').children('div').css('display','none');
	$('.content').children('div:eq(0)').css('display','block');
	$('.subHeader > ul > li').click(function() {
		var feedId = $(this).children('a').prop('id');
		var newFeedId = feedId.replace('Call','');
		//alert(newFeedId);
		if(newFeedId != ''){
			$('.content').children('div').css('display','none');
			$('.content').children('#'+newFeedId+'').css('display','block');
			getFeedData(newFeedId);
		}
		
	});
});
