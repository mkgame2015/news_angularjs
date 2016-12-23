var app = angular.module("newsApp", ["ui.router", "ng.post"]);
app.config(function($stateProvider) {
	$stateProvider.state("index", {
			url: "/index",
			templateUrl: "template/index.html",
			controller: "indexCtrl"
		}).state("index.list", {
			url: "/list",
			templateUrl: "template/list.html",
			controller: "listCtrl"
		}).state("detail", {
			url: "/detail/:channelIdx/:channelId/:nid",
			templateUrl: "template/detail.html",
			controller: "detailCtrl"
		})
		//	.state("index.secondlist", {
		//		url: "/secondlis",
		//		templateUrl: "template/secondlis.html",
		//		controller: "secondlisCtrl"
		//	}).state("index.thirdlist", {
		//		url: "/thirdlist",
		//		templateUrl: "template/thirdlis.html",
		//		controller: "thirdlisCtrl"
		//	})
})
app.controller("indexCtrl", function($scope, $rootScope, $window) {
	//  $rootScope.id = id;
	$scope.tabs = [{
		id: 1,
		name: "国内焦点",
		url: "#/index/list"
	}, {
		id: 2,
		name: "国际焦点",
		url: "#/index/secondlist"
	}, {
		id: 3,
		name: "游戏焦点",
		url: "#/index/thirdlist"
	}, {
		id: 4,
		name: "登录",
		url: "#/login"
	}];
	$scope.toggleTab = function(id, url) {
		$rootScope.id = id;
		$window.location.href = url;
	}
})
app.controller("listCtrl", function($scope, $http,$window,swiperImg) {
	//返回顶层的默认隐藏
	$scope.topShow = false;
	//加载中样式默认状态
	$scope.isShow = true;
	//默认隐藏排序选项
	$scope.sortShow = false;
	//定义排序标准,按时间排序
	$scope.type = 'pubDate';
	//定义排序类型 ,
	$scope.switchCp = false;
	//定义搜索栏起始状态
	$scope.issearch = false;
	//定义获取新闻起始页
	$scope.page = 1;
	//定义存储新闻数组
	$scope.newslist = [];
	$scope.channelId = '5572a108b3cdc86cf39001cd';
	$scope.channelIdx = 1;
	//定义加载新闻函数
	var load = function() {
			$http.jsonp("news2.php", {
				params: {
					page: $scope.page,
					channelId: $scope.channelId,
					channelName: '国内焦点',
					callback: 'JSON_CALLBACK'
				}
			}).success(function(data) {
				$scope.isShow = true;
				console.log(data);
				$scope.newslist = $scope.newslist.concat(data.showapi_res_body.pagebean.contentlist);
				console.log($scope.newslist.length)
				angular.forEach($scope.newslist,function(data,index){
					data.nid = index;
				});
				console.log($scope.newslist);
				//				console.log($scope.newslist);
				//定义轮播图获取函数
				$scope.swiperImgs = swiperImg.getImgs($scope.newslist);
				//				console.log($scope.swiperImgs);
			})
		}
		//第一次加载
	load();
	//定义加载更多的函数
	$scope.loadmore = function() {
			$scope.topShow = true;
			$scope.isShow = false;
			$scope.page++;
			load();
		}
	//定义搜索
	$scope.search = function() {
		$scope.issearch = true;
	};
	$scope.searchClear = function() {
		$scope.issearch = false;
	};
	//返回页面顶端的函数定义
	$scope.goPageTop = function(){
		$window.scrollTo(0,0);
		$scope.topShow = false;
		
	}
});
app.controller("detailCtrl", function($scope, $http, $state) {
	$scope.isShow = false;
	$scope.galleryShow = false;
	$scope.nid = parseInt($state.params.nid);
	$scope.nidnext = $scope.nid +1 ;
	$scope.channelId = $state.params.channelId;
	$scope.channelIdx = parseInt($state.params.channelIdx);
	if($scope.channelIdx == 1){
		$scope.listurl = "#/index/list";
	}else if($scope.channelIdx == 2){
		$scope.listurl = "#/index/secondlist";
	}else if($scope.channelIdx == 3){
		$scope.listurl = "#/index/thirdlist"
	};
	$scope.showGallery = function(url){
		$scope.galleryShow = true;
		$scope.bgurl = url;
		console.log($scope.bgurl);
	}
//	$scope.page = parseInt($scope.nid/20) + 1;
	var load = function() {
		var page = parseInt($scope.nid/20) + 1;
		var idx = $scope.nid%20;
		if(idx == 19){
		$http.jsonp("news2.php", {
			params: {
				page: page,
				channelId: $scope.channelId,
				callback: 'JSON_CALLBACK'
			}
		}).success(function(data) {
			$scope.new = data.showapi_res_body.pagebean.contentlist[idx];
			$scope.isShow = true;
			
		});
		$http.jsonp("news2.php", {
			params: {
				page: page+1,
				channelId: $scope.channelId,
				callback: 'JSON_CALLBACK'
			}
		}).success(function(data) {
			$scope.newnext = data.showapi_res_body.pagebean.contentlist[0];
		});
		}else{
			$http.jsonp("news2.php", {
			params: {
				page: page,
				channelId: $scope.channelId,
				callback: 'JSON_CALLBACK'
			}
		}).success(function(data) {
			$scope.new = data.showapi_res_body.pagebean.contentlist[idx];
			$scope.newnext = data.showapi_res_body.pagebean.contentlist[idx+1];
			$scope.isShow = true;			
		})
		}
		$http.jsonp("news2.php", {
			params: {
				page: page,
				channelId: $scope.channelId,
				callback: 'JSON_CALLBACK'
			}
		}).success(function(data) {
			$scope.new = data.showapi_res_body.pagebean.contentlist[idx];
		})
	}
	load();
});
//组件定义
app.directive("newslist", function() {
	return {
		templateUrl: "directive/newslist.html"
	}
});
app.directive("search", function() {
	return {
		templateUrl: "directive/search.html"
	}
});
app.directive("swiper", function() {
	return {
		templateUrl: "directive/swiper.html",

		link: function(scope, ele, attr) {
			var swiper = new Swiper('.swiper-container', {
				pagination: '.swiper-pagination',
				paginationClickable: true
			});
		}
	}
});
//定义自定义服务
app.service("swiperImg", function() {
	return {
		getImgs: function(data, num) {
			if(num) {} else {
				num = 3;
			}
			var imgs = [];
			angular.forEach(data, function(data, index) {
				if(data.havePic && imgs.length <= num) {
					data.id = index;
					imgs.push(data);
				}
			});
			//			console.log(imgs);
			return imgs;
		}
	}
})