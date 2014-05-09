angular.module('galleryApp', ["ngTouch"]);

angular.module('galleryApp').directive('gallery',
    function ($timeout, $swipe) {
        'use strict';
        
        return {
            restrict: 'E',
            replace: true,
            scope : {
                open : '=open',
                galleryImages : '=galleryImages'
            },
            controller: function ($scope, $element) {

                $scope.selectImage = function (idx, isScroll, animDirection) {

                    
                    var animClass = 'gallery__mainimg--shrinked',
                        animClassDelay = 0;

                    if (animDirection === 'from-left') {
                        animClass = 'gallery__mainimg--fromleft';
                        animClassDelay = 100;
                    }
                    if (animDirection === 'from-right') {
                        animClass = 'gallery__mainimg--fromright';
                        animClassDelay = 100;
                    }
                    if (animDirection === 'from-top') {
                        animClass = 'gallery__mainimg--fromtop';
                        animClassDelay = 100;
                    }
                    if (animDirection === 'from-bottom') {
                        animClass = 'gallery__mainimg--frombottom';
                        animClassDelay = 100;
                    }

                    angular.element('.gallery__mainimg').addClass(animClass);

                    var index = idx ? idx : 0;

                    $scope.galleryMainImg = $scope.galleryImages[index].url;
                    $scope.galleryMainImgTitle = $scope.galleryImages[index].title;

                    $scope.selectedImg = idx;

                    if ($scope.open) {
                        $timeout(function () {
                            repositionThumbnails(isScroll);
                        });
                    }

                    if (animClassDelay === 0) {
                        angular.element('.gallery__mainimg').removeClass(animClass);
                    } else {
                        $timeout(function () {
                            angular.element('.gallery__mainimg').removeClass(animClass);
                        }, animClassDelay);
                    }
                    
                    


                };

                $scope.nextImage = function (isScroll, animDirection) {
                    $scope.selectedImg = $scope.selectedImg === ($scope.galleryImages.length - 1) ? $scope.selectedImg : ($scope.selectedImg + 1);
                    $scope.selectImage($scope.selectedImg, isScroll, animDirection);
                };
                
                $scope.prevImage = function (isScroll, animDirection) {
                    $scope.selectedImg = $scope.selectedImg === 0 ? $scope.selectedImg : ($scope.selectedImg - 1);
                    $scope.selectImage($scope.selectedImg, isScroll, animDirection);
                };

                $scope.selectImage(0);

                $scope.timesOpened = 0;

                $scope.$watch('open', function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        if (newVal) {
                            

                            $('body').addClass('scrollbar-hidden');
                            
                            if ($scope.timesOpened === 0) {
                                
                                $element.bind('mousewheel DOMMouseScroll', function (e) {
                                    //IE exception // because IE makes a secondary call of 240 scroll size.
                                    if (e.originalEvent.wheelDelta !== 240 && e.originalEvent.wheelDelta !== -240) {
                                    
                                        if (e.originalEvent.wheelDelta / 120 > 0 || e.originalEvent.detail / 3 < 0) {
                                            $scope.prevImage(true);
                                        }
                                        else {
                                            $scope.nextImage(true);
                                        }
                                        $scope.$apply();
                                    }
                                });


                                angular.element('body').bind('keyup', function (e) {
                                    if ($scope.open) {
                                        if (e.keyCode === 27) {
                                            //escape
                                            $scope.open = false;
                                            $scope.$apply();
                                        } else if (e.keyCode === 39) {
                                            //right
                                            $scope.nextImage(true, 'from-right');
                                        } else if (e.keyCode === 40) {
                                            //down
                                            $scope.nextImage(true, 'from-bottom');
                                        } else if (e.keyCode === 37) {
                                            //left
                                            $scope.prevImage(true, 'from-left');
                                        } else if (e.keyCode === 38) {
                                            //up
                                            $scope.prevImage(true, 'from-top');
                                        }

                                        $scope.$apply();
                                    }
                                });
                                

                                $scope.timesOpened += 1;

                            }

                        } else {
                            $('body').removeClass('scrollbar-hidden');
                        }
                        
                        
                    }
                });


                function repositionThumbnails() {
                    
                    //manage the thumbnail position on screen (scroll)
                    var galleryHeight = $('.gallery__contents').height(),
                        thumblist = $('.gallery__thumb-list ul'),
                        thumblistHeight = thumblist.height(),
                        thumblistTopMargin = parseInt(thumblist.css('margin-top'), 10),
                        activeImg = thumblist.find('img.active'),
                        activeImgMidline = activeImg.position().top - thumblistTopMargin + activeImg.height() / 2,
                        thumblistMidline = galleryHeight / 2 - thumblistTopMargin,
                        midlineDifference = activeImgMidline - thumblistMidline,
                        newTopMargin,
                        scrollTime;
                    
                    if (activeImgMidline < thumblistMidline) {
                        if (Math.abs(thumblistTopMargin) > Math.abs(midlineDifference)) {
                            newTopMargin = thumblistTopMargin - midlineDifference;
                        } else {
                            newTopMargin = 0;
                        }
                    }

                    if (activeImgMidline > thumblistMidline) {
                       
                        if (Math.abs(thumblistTopMargin) > Math.abs(midlineDifference)) {
                            newTopMargin = thumblistTopMargin - Math.abs(midlineDifference);
                        } else {
                            newTopMargin = thumblistMidline - activeImgMidline;
                        }
                    }

                    if (Math.abs(newTopMargin) > thumblistHeight - galleryHeight && thumblistHeight > galleryHeight) {
                        newTopMargin = - 50 - (thumblistHeight - galleryHeight);
                    }

                    scrollTime = arguments[0] ? 50 : Math.max(Math.floor(Math.abs(thumblistTopMargin - newTopMargin)), 200);
                    thumblist.stop().animate({'margin-top': newTopMargin + 'px'}, scrollTime);
                }
            },
            link: function (scope, elm, attrs) {
                scope.galleryTitle = attrs.galleryTitle;
                
                /*
                var start, end;

                $swipe.bind(angular.element('.gallery__mainimg__holder'), {
                    'start' : function (e) {

                        start = e;

                    },
                    'move' : function (e) {

                        end = e;

                        console.log(start, end);

                    }
                });
                */
                
            },
            templateUrl : '/src/angular-gallery.html'
        };
    }
);