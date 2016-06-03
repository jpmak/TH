!
function(b) {
	b.raf = b.requestAnimationFrame || b.webkitRequestAnimationFrame;
	var a = b.navigator.userAgent;
	b.device = {
		isApp: a.match(/SNEBUY-APP;?/i) ? true: false,
		isYfb: a.match(/SNYifubao;?/i) ? true: false,
		isAndroid: a.match(/android/i) ? true: false,
		isIOS: a.match(/(iPhone|iPod|iPad);?/i) ? true: false,
		isWX: a.match(/MicroMessenger/i) ? true: false
	};
	b.Setting = {
		IMG_HOST: {
			PRD: "http://image" + parseInt(Math.floor(Math.random() * 10) % 3 + 1) + ".suning.cn",
			SIT: "http://sit1image" + parseInt(Math.floor(Math.random() * 10) % 3 + 1) + ".suning.cn",
			PRE: "http://uimgpre.cnsuning.com",
			DEV: "http://image.suning.cn"
		},
		WAP_HOST: {
			PRD: "http://m.suning.com",
			SIT: "http://msit.cnsuning.com",
			PRE: "http://mpre.cnsuning.com",
			DEV: "http://mpre.cnsuning.com"
		},
		ICPS_HOST: {
			PRD: "http://icps.suning.com",
			SIT: "http://icpssit.cnsuning.com",
			PRE: "http://icpspre.cnsuning.com",
			DEV: "http://icps.suning.com"
		},
		SHOP_HOST: {
			PRD: "http://shop.m.suning.com",
			SIT: "http://shop.msit.cnsuning.com",
			PRE: "http://shop.mpre.cnsuning.com",
			DEV: "http://shop.mpre.cnsuning.com"
		},
		COOKIE_HOST: {
			PRD: ".suning.com",
			SIT: ".cnsuning.com",
			PRE: ".cnsuning.com",
			DEV: ".cnsuning.com"
		},
		DS_HOST: {
			PRD: "http://ds.suning.cn",
			SIT: "http://dssit.cnsuning.com",
			PRE: "http://dspre.cnsuning.com",
			DEV: "http://ds.suning.cn"
		},
		cityId: $.cookie("cityId") || "9173",
		provinceCode: $.cookie("provinceCode") || "100",
		districtId: $.cookie("districtId") || "11365",
		cityCode: $.cookie("cityCode") || "025"
	};
	b.Util = {
		envName: null,
		serverOffset: null,
		getEnvName: function() {
			if (!this.envName) {
				var c = document.location.hostname,
				d;
				var e = /(\W)*.suning.com$/;
				var g = /(\W)*pre(.*)*.cnsuning.com$/;
				var f = /(\W)*sit(.*)*.cnsuning.com$/;
				if (g.test(c)) {
					d = "PRE"
				} else {
					if (f.test(c)) {
						d = "SIT"
					} else {
						if (e.test(c)) {
							d = "PRD"
						} else {
							d = "DEV"
						}
					}
				}
				return d
			} else {
				return this.envName
			}
		},
		formatProCode: function(f) {
			f = f.toString();
			var d = "";
			if (f) {
				if (f.length <= 18) {
					var c = 18 - f.length;
					for (var e = 0; e < c; e++) {
						d += "0"
					}
				}
			}
			return d + f
		},
		getProductUrl: function(d, c) {
			return Setting.WAP_HOST[this.getEnvName()] + "/product/" + c + "/" + d + ".html"
		},
		getProductImg: function(d, c) {
			var e;
			switch (c) {
			case 120:
				e = "120x120";
				break;
			case 200:
				e = "200x200";
				break;
			case 220:
				e = "220x220";
				break;
			case 400:
				e = "400x400";
				break;
			default:
				e = "200x200"
			}
			return Setting.IMG_HOST[this.getEnvName()] + "/b2c/catentries/" + this.formatProCode(d) + "_1_" + e + ".jpg"
		},
		getShopUrl: function(c) {
			return Setting.SHOP_HOST[this.getEnvName()] + "/" + c + ".html"
		},
		checkLogin: function() {
			var c = $.Deferred();
			$.probeAuthStatus(function() {
				c.resolve()
			},
			function() {
				c.reject()
			});
			return c.promise()
		},
		getCurrentTime: function() {
			var e = $.Deferred(),
			c;
			if (this.serverOffset) {
				c = new Date().getTime() + this.serverOffset;
				e.resolve(c)
			} else {
				$.ajax({
					url: "http://cms.api.suning.com/time/getCurrentTime.do",
					dataType: "jsonp",
					timeout: 3000,
					success: function(d) {
						c = parseInt(d.currentTime);
						this.serverOffset = c - new Date().getTime();
						e.resolve(c)
					},
					error: function() {
						c = new Date().getTime();
						e.resolve(c)
					}
				})
			}
			return e.promise()
		}
	};
	b.CountDown = function(d) {
		function c(e) {
			this.opts = e || {};
			this.obj = this.opts.obj;
			this.nowTime = this.opts.nowTime;
			this.startTime = this.opts.startTime;
			this.endTime = this.opts.endTime;
			this.dayNode = this.opts.dayNode || ".day-node";
			this.hourNode = this.opts.hourNode || ".hour-node";
			this.minuteNode = this.opts.minuteNode || ".minute-node";
			this.secondNode = this.opts.secondNode || ".second-node";
			this.beforeStart = this.opts.beforeStart ||
			function() {};
			this.isStart = this.opts.isStart ||
			function() {};
			this.callback = this.opts.callback ||
			function() {};
			this.speed = this.opts.speed || 1000;
			this.timeOffset = 0;
			this.gap = [];
			this.auto = null
		}
		c.prototype = {
			init: function() {
				var e = this;
				e.timeOffset = e.nowTime - new Date().getTime();
				e.timer();
				e.run()
			},
			timer: function() {
				var e = this,
				f = this.nowTime;
				if (e.startTime && parseInt(e.startTime) > parseInt(f)) {
					e.gap = e.parse(e.startTime - f);
					e.html();
					this.beforeStart()
				} else {
					if (e.endTime && parseInt(e.endTime) > parseInt(f)) {
						e.gap = e.parse(e.endTime - f);
						e.html();
						this.isStart()
					}
				}
				if (parseInt(e.endTime) < parseInt(this.nowTime)) {
					clearTimeout(e.auto);
					this.callback()
				}
				this.nowTime = new Date().getTime() + this.timeOffset
			},
			parse: function(g) {
				var e = this,
				f = g / e.speed;
				e.second = Math.round(f % 60);
				e.minute = Math.floor((f / 60) % 60);
				e.hour = Math.floor((f / 60 / 60) % 24);
				e.day = Math.floor(f / 60 / 60 / 24);
				if (e.second < 10) {
					e.second = "0" + e.second
				}
				if (e.minute < 10) {
					e.minute = "0" + e.minute
				}
				if (e.hour < 10) {
					e.hour = "0" + e.hour
				}
				if (e.day < 10) {
					e.day = "0" + e.day
				}
				return [e.second, e.minute, e.hour, e.day]
			},
			html: function() {
				var e = this;
				e.obj.find(this.dayNode).html(e.gap[3]);
				e.obj.find(this.hourNode).html(e.gap[2]);
				e.obj.find(this.minuteNode).html(e.gap[1]);
				e.obj.find(this.secondNode).html(e.gap[0])
			},
			run: function() {
				var e = this;
				e.auto = setInterval(function() {
					e.timer()
				},
				500)
			}
		};
		new c(d).init()
	}; !
	function() {
		var l = Util.getEnvName();
		var f = Setting.ICPS_HOST[l] + "/icps-web/getVarnishAllPrice014/",
		q = 20,
		i = device.isApp ? "2": "5",
		o = "2",
		d = "cms",
		n = "025",
		k = "",
		p = "getAllPrice",
		e = [],
		h = 0,
		g = 0,
		m = false;
		function j(s) {
			var t = this,
			r = [];
			s = s || {};
			t.each(function(v, w) {
				var u = $(w);
				if (u.attr("data-procode") && u.attr("data-getprice") != "done") {
					u.attr("data-getprice", "done");
					r.push(w)
				}
			});
			$.each(r,
			function(w, z) {
				var v = $(z),
				y = Math.ceil((w + 1) / q) - 1 + h,
				x = Util.formatProCode(v.attr("data-procode")),
				u = v.attr("data-vendorcode");
				if (!u) {
					u = ""
				} else {
					if (u == "0") {
						u = "0000000000"
					}
				}
				if (w % q === 0) {
					var A = {
						domList: [],
						cmmdtyCodeList: [],
						bizCodeList: [],
						cityCode: s.cityCode || n,
						area: s.areaCode || k,
						chan: s.chan || i,
						isDefaultWork: s.isDefaultWork,
						callback: s.callback
					};
					e.push(A)
				}
				e[y].domList.push(z);
				e[y].cmmdtyCodeList.push(x);
				e[y].bizCodeList.push(u)
			});
			h = e.length;
			c(false)
		}
		function c(r) {
			if (e.length == 0) {
				return
			}
			if (!r && m) {
				return
			}
			m = true;
			var y = e[g];
			if (!y) {
				return
			}
			g++;
			var t = y.cmmdtyCodeList.join(","),
			w = y.cityCode,
			v = y.area,
			x = y.chan,
			u = y.bizCodeList.join(","),
			s = o;
			$.ajax({
				dataType: "jsonp",
				url: f + t + "_" + w + "_" + v + "_" + u + "_" + x + "_" + p + g + ".vhtm",
				cache: true,
				timeout: 10000,
				jsonpCallback: p + g
			}).done(function(z) {
				if (!z) {
					return
				}
				if (typeof y.callback == "function") {
					y.callback(z, y.domList)
				}
				if (y.isDefaultWork == false) {
					return
				}
				$(y.domList).each(function(B, E) {
					if (z[B]) {
						var D = $(E);
						var C = z[B];
						if (C.status == 2) {
							D.addClass("sellout");
							D.find(".sale-price").html("售罄")
						} else {
							var A = parseFloat(C.price);
							var F = parseFloat(C.refPrice || C.snPrice);
							if (A) {
								D.find(".sale-price").html("￥" + A.toFixed(2))
							} else {
								D.addClass("sellout");
								D.find(".sale-price").html("售罄")
							} (A < F) && D.find(".tag-price").html("￥" + F.toFixed(2))
						}
					}
				})
			}).fail(function(A, z) {
				console.log(A, z)
			}).always(function() {
				c(true);
				m = false
			})
		}
		$.fn.getProPrice = j
	} ();
	b.Home = {
		pageInit: function() {
			$("#Sn_Loading").remove();
			$("#indexWrap").removeClass("hide");
			$("#floor").lazyload();
			$(".v5-title").lazyload(function(o) {
				if (o.attr("data-bg") == "done") {
					return
				}
				o.css("background-image", "url(" + o.attr("data-bg") + ")");
				o.attr("data-bg", "done")
			});
			lazyload($(".app-down"));
			$(".app04").lazyload();
			var k = new Date();
			k.setTime(k.getTime() + (365 * 24 * 60 * 60 * 1000));
			$.cookie("index_v3", "1", {
				path: "/",
				domain: sn_config.cookieDomain,
				expires: k
			});
			$("#searchInput").on("click",
			function() {
				b.location.href = sn_config.base + "/search.html"
			});
			var h = b.innerHeight || b.screen.height;
			var f = $("#Top");
			var c = $(".v5-top");
			var g = $(".v5-class");
			var n = $(".v5-bottom");
			$(b).on("scroll touchmove",
			function() { (b.scrollY < 1.5 * h) ? f.addClass("hide") : f.removeClass("hide");
				if (c) { (b.scrollY < 0.5 * h) ? c.addClass("hide") : c.removeClass("hide")
				}
				if (g) { (b.scrollY < 0.5 * h) ? g.addClass("hide") : g.removeClass("hide")
				}
				if (n[0]) {
					if ((b.scrollY >= $(".v5-bottom").offset().top - 0.5 * h) && (b.scrollY <= $(".v5-bottom").offset().top + $(".v5-bottom").offset().height - h)) {
						$(".v5-bottom .btn").show()
					} else {
						$(".v5-bottom .btn").hide()
					}
				}
			});
			Home.stickTop(".sticky");
			$(".v5-class .btn").on("click",
			function() {
				$(".v5-class").toggleClass("auto");
				$(".v5-class .header").toggleClass("shadow");
				$(".v5-class .header ul").toggleClass("hide");
				$(".v5-class .header .tips").toggleClass("hide");
				$(this).toggleClass("rotate");
				$(".v5-class .content").toggleClass("hide")
			});
			$(".v5-class").on("click", ".header:not(.shadow) .btn",
			function() {
				$("html, body").removeClass("lock")
			});
			$(".v5-class").on("click", ".shadow .btn",
			function() {
				$("html, body").addClass("lock")
			});
			$(".v5-bottom .btn").on("click",
			function() {
				b.scrollTo(0, $("#guessulike").offset().top - 0.5 * h)
			});
			var l = $(".v5-new");
			var i = $(".v5-new-btn");
			var d = $(".v5-new-gap");
			var j = $(".v5-new-space");
			if (l.length) {
				$.probeAuthStatus(function() {
					$.ajax({
						dataType: "jsonp",
						url: sn_config.base + "/mts-web/wapdata/private/isnewer.do"
					}).done(function(o) {
						if (o && o.data && o.data.isNewer) {
							l.show();
							i.show();
							d.show();
							j.show()
						}
					})
				},
				function() {})
			}
			$('a[linktype="3"]').each(function() {
				var q = $(this);
				var o = q.attr("data-code");
				if (o) {
					var p = sn_config.wapDomain + "/channel/" + o + ".html";
					q.attr("href", p)
				}
			});
			var e = $.cookie("wapToEbay");
			var m = $(".v5-headDown");
			if (!device.isApp && !e && m.length) {
				m.removeClass("hide");
				m.find("a").click(function() {
					b.topDownloadApp(false, true)
				});
				$(".del").click(function() {
					$(this).parent().hide();
					var p = new Date();
					var o = {
						path: "/",
						domain: sn_config.cookieDomain,
						expires: p.setTime(p + (1 * 24 * 60 * 60 * 1000))
					};
					$.cookie("wapToEbay", "clientPrd", o)
				})
			}
			this.showCartNum();
			this.msgInit();
			this.msg1Init();
			this.initFooter();
			this.guessulikeFuc()
		},
		showCartNum: function() {
			setTimeout(function() {
				var f = $.cookie("totalProdQtyv3");
				var e = $.cookie("mtisCartQty");
				f = (typeof f === "undefined" || f == 0) ? 0 : parseInt(f);
				e = (typeof e === "undefined" || e == 0) ? 0 : parseInt(e);
				var c;
				var d = $.cookie("mtisAbTest");
				if (d == "B") {
					c = e
				} else {
					c = f + e
				}
				if (c == 0) {
					$("#cartnum").html("")
				} else {
					if (c >= 100) {
						$("#cartnum").html("<span class='count'><em>99<i>+</i></em></span>")
					} else {
						$("#cartnum").html("<span class='count'><em>" + c + "</em></span>")
					}
				}
			},
			200)
		},
		widgetInit: function() {
			var c = $.Deferred(),
			d = this;
			$.loadScript({
				srcArr: [sn_config.channelRes + "/project/mvs/RES/common/script/??module/iscroll-lite/5.1.3/iscroll-lite.js,module/alertBox/2.0.0/alertBox.js,module/swipe/1.1.0/swipe.js"],
				withoutGa: true,
				loadComplete: function() {
					var e = $(".swipe");
					e.each(function() {
						var j = $(this);
						var k = j.find(".trigger"),
						f = j.find("li").length,
						g = '<li class="cur"></li>';
						if (f > 1) {
							for (var h = 0; h < f - 1; h++) {
								g += "<li></li>"
							}
							k.append(g);
							j.Swipe({
								speed: 400,
								auto: 4000,
								callback: function(i, l) {
									if (f == 2) {
										i = i % 2
									}
									$(l).find("img").each(function() {
										if ($(this).attr("data-src2")) {
											$(this).attr("src", $(this).attr("data-src2"));
											$(this).removeAttr("data-src")
										}
									});
									j.find(".trigger li").eq(i).addClass("cur").siblings().removeClass("cur")
								}
							})
						}
					});
					$(".app-scroller").each(function() {
						var j = $(this);
						var f = j.find(".scroll-to-more");
						var i = new IScroll(this, {
							scrollX: true,
							scrollY: false,
							tap: true,
							useTransform: (a.match(/(MI|vivo|MX);?/i) && a.match(/(SNEBUY-APP);?/i)) ? false: true,
							probeType: f.length > 0 ? 1 : 3,
							eventPassthrough: true
						});
						var h = $(this).data("link");
						if (f.length == !0) {
							i.on("scroll",
							function() {
								if (this.x < this.maxScrollX - this.wrapperWidth / 5.8) {
									location.href = f.find("a").attr("href")
								}
							})
						}
						i.on("scrollEnd", g);
						function g() {
							j.find("img").each(function() {
								var k = $(this),
								m = k[0],
								l = j.offset().left;
								if (m.getAttribute("data-isrc") == null) {
									return
								}
								if ((k.offset().left >= l) && (k.offset().left - l < i.wrapperWidth) && (m.getAttribute("data-isrc") != "done")) {
									if (k.offset().top < b.innerHeight + b.scrollY) {
										m.onerror = function() {
											this.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
										};
										m.src = m.getAttribute("data-isrc");
										m.setAttribute("data-isrc", "done")
									} else {
										m.setAttribute("data-src", m.getAttribute("data-isrc"));
										m.removeAttribute("data-isrc")
									}
								}
							})
						}
						g()
					});
					c.resolve()
				}
			});
			return c.promise()
		},
		keyWordInit: function() {
			var c = $.Deferred();
			$.ajax({
				url: Setting.DS_HOST[Util.getEnvName()] + "/ds/terminal/hotword/99999998-wap-keyword.jsonp",
				cache: true,
				dataType: "jsonp",
				jsonpCallback: "keyword"
			}).done(function(f) {
				if (f.rs) {
					try {
						var d = f.rs.defaultWord[0].word;
						$("#searchInput").attr("placeholder", d)
					} catch(g) {}
				}
			}).always(function() {
				c.resolve()
			});
			return c.promise()
		},
		msgInit: function() {
			var d = $(".app40");
			if (d.length == 0) {
				return
			}
			var c = d.find(".msg").length;
			var f = 0;
			if (c > 1) {
				d.find(".msgs").append(d.find(".msg").eq(0).clone());
				var e = d.find(".msgs").height() / c;
				setInterval(function() {
					f++;
					d.find(".msgs").addClass("ani").css("-webkit-transform", "translateY(-" + 1 * (f) + "rem)");
					setTimeout(function() {
						if (f == c) {
							d.find(".msgs").removeClass("ani").css("-webkit-transform", "translateY(0)");
							f = 0
						}
					},
					300)
				},
				4000)
			}
		},
		msg1Init: function() {
			var d = $(".v5-tt");
			if (d.length == 0) {
				return
			}
			var c = d.find(".msg").length;
			var f = 0;
			if (c > 1) {
				d.find(".msgs").append(d.find(".msg").eq(0).clone());
				var e = d.find(".msgs").height() / c;
				setInterval(function() {
					f++;
					d.find(".msgs").addClass("ani").css("-webkit-transform", "translateY(-" + 1.28 * (f) + "rem)");
					setTimeout(function() {
						if (f == c) {
							d.find(".msgs").removeClass("ani").css("-webkit-transform", "translateY(0)");
							f = 0
						}
					},
					300)
				},
				4000)
			}
		},
		countDownInit: function() {
			var c = $(".mini-count"),
			d = $(".full-count");
			if (c.length + d.length > 0) {
				Util.getCurrentTime().done(function(e) {
					c.each(function() {
						CountDown({
							obj: $(this).find(".count-text"),
							startTime: $(this).attr("data-startTime"),
							endTime: $(this).attr("data-endtime"),
							nowTime: e,
							beforeStart: function() {},
							isStart: function() {
								var h = this.gap[3] > 99 ? true: false;
								var f = h ? ["9", "9"] : this.gap[3].toString().split(""),
								i = h ? ["2", "3"] : this.gap[2].toString().split(""),
								j = h ? ["5", "9"] : this.gap[1].toString().split(""),
								g = h ? ["5", "9"] : this.gap[0].toString().split("");
								if (parseInt(i) > 0) {
									this.obj.html('<span class="clock-icon"></span> 剩余<i>' + f[0] + f[1] + "</i>天<i>" + i[0] + i[1] + "</i>时")
								} else {
									this.obj.html('<span class="clock-icon"></span> 仅剩<i>' + j[0] + j[1] + "</i>分<i>" + g[0] + g[1] + "</i>秒")
								}
							},
							callback: function() {
								this.obj.hide()
							}
						})
					});
					d.each(function() {
						CountDown({
							obj: $(this).find(".count-text"),
							startTime: $(this).attr("data-startTime"),
							endTime: $(this).attr("data-endtime"),
							nowTime: e,
							beforeStart: function() {},
							isStart: function() {
								var h = this.gap[3] > 99 ? true: false;
								var f = h ? ["9", "9"] : this.gap[3].toString().split(""),
								i = h ? ["2", "3"] : this.gap[2].toString().split(""),
								j = h ? ["5", "9"] : this.gap[1].toString().split(""),
								g = h ? ["5", "9"] : this.gap[0].toString().split("");
								this.obj.find(this.dayNode).html("<i>" + f[0] + "</i><i>" + f[1] + "</i>");
								this.obj.find(this.hourNode).html("<i>" + i[0] + "</i><i>" + i[1] + "</i>");
								this.obj.find(this.minuteNode).html("<i>" + j[0] + "</i><i>" + j[1] + "</i>");
								this.obj.find(this.secondNode).html("<i>" + g[0] + "</i><i>" + g[1] + "</i>")
							},
							callback: function() {
								this.obj.hide()
							}
						})
					})
				})
			}
		},
		geoInit: function() {
			var c = $.Deferred();
			if (!device.isApp) {
				if (!$.cookie("cityId") || !$.cookie("cityCode")) {
					var d = new Date();
					d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
					var e = {
						path: "/",
						domain: sn_config.cookieDomain,
						expires: d
					};
					$.loadScript({
						srcArr: [sn_config.channelRes + "/project/mvs/RES/common/script/module/geo/1.0.0/geo.js"],
						withoutGa: true,
						loadComplete: function() {
							Wap.Geo(function(f) {
								$.cookie("cityId", f.cityNo, e);
								$.cookie("cityCode", f.cityCode, e);
								$.cookie("provinceCode", f.provinceCode, e);
								$.cookie("districtId", f.distNo, e);
								c.resolve()
							})
						}
					})
				}
			} else {
				c.resolve()
			}
			return c.promise()
		},
		hotMarktInit: function() {
			var c = $.Deferred();
			var g = $(".app38");
			if (!g.length == 0) {
				var d = $.cookie("_snma") || "",
				e = $.cookie("custno") || "";
				d && (d = d.split("|")[1]);
				var f = {
					cityId: Setting.cityId,
					sceneIds: "10-49",
					c: d,
					u: e
				};
				$.ajax({
					type: "GET",
					url: sn_config.tujianDomain + "/recommend-portal/recommend/paramsBiz.jsonp",
					data: f,
					cache: true,
					dataType: "jsonp"
				}).done(function(k) {
					if (k.sugGoods && !(k.sugGoods[0].resCode == "02") && k.sugGoods[0].skus.length === 11) {
						var j = k.sugGoods[0].skus;
						var l = $(".app38 a");
						var i = $(".app38 li");
						var h = {
							fullImgList: [],
							smallImgList: [],
							hrefList: [],
							nameList: []
						};
						l.each(function(n, o) {
							var m = $(o);
							h.fullImgList.push(m.attr("data-fullimg"));
							h.smallImgList.push(m.attr("data-smallimg"));
							h.hrefList.push(m.attr("href"));
							h.nameList.push(m.attr("name"))
						});
						$.each(j,
						function(m, o) {
							var n = o;
							l.each(function(q, s) {
								var p = $(s);
								if (p.data("suggoodscode") == n.sugGoodsCode) {
									var r = (m < 2) ? (h.fullImgList[q]) : (h.smallImgList[q]);
									i.eq(m).html("<a href=" + h.hrefList[q] + " name=" + h.nameList[q] + "><img data-src=" + r + ' alt=""></a>');
									return false
								}
							})
						})
					}
					c.resolve()
				})
			} else {
				c.resolve()
			}
			return c.promise()
		},
		initSwipe: function() {
			var c = $(".v5-hd");
			c.each(function() {
				var g = $(this);
				var h = g.find(".trigger"),
				d = g.find("li").length,
				e = '<li class="cur"></li>';
				if (d > 1) {
					for (var f = 0; f < d - 1; f++) {
						e += "<li></li>"
					}
					h.append(e);
					g.Swipe({
						speed: 400,
						callback: function(i, j) {
							if (d == 2) {
								i = i % 2
							}
							$(j).find("img").each(function() {
								if ($(this).attr("data-src2")) {
									$(this).attr("src", $(this).attr("data-src2"));
									$(this).removeAttr("data-src")
								}
							});
							g.find(".trigger li").eq(i).addClass("cur").siblings().removeClass("cur")
						}
					})
				}
			})
		},
		stickTop: function(g) {
			if (!document.querySelector(g)) {
				return
			}
			var e = $(g),
			d = e.parent().find(".placeholder"),
			f = e.parent().offset().top;
			function c() {
				if (e.css("position").indexOf("sticky") < 0) {
					var h = e.parent().offset().top;
					b.scrollY > h ? e.css("position", "fixed") && d.height(e.height()) : e.css("position", "static") && d.height(0)
				}
			}
			c();
			b.addEventListener("scroll", c)
		},
		recommandShopsInit: function() {
			var c = $.Deferred();
			var g = $(".v5-hd .swipe-ul");
			if (!g.length == 0) {
				var d = $.cookie("_snma") || "",
				e = $.cookie("custno") || "";
				d && (d = d.split("|")[1]);
				var f = {
					cityId: Setting.cityId,
					sceneIds: "18-7",
					mark: "A",
					c: d,
					u: e,
					count: 6
				};
				$.ajax({
					type: "GET",
					url: sn_config.tujianDomain + "/recommend-portal/recommend/paramsBiz.jsonp",
					data: f,
					cache: true,
					dataType: "jsonp"
				}).done(function(i) {
					if (i.sugGoods && !(i.sugGoods[0].resCode == "02")) {
						try {
							var k = i.sugGoods[0].shops;
							skus = k.skus;
							$.each(k,
							function(l, n) {
								var m = k[l].skus;
								k[l].linkUrl = Util.getShopUrl(k[l].shopId);
								$.each(m,
								function(o, p) {
									if (o == 0) {
										p.imgSrc = Util.getProductImg(p.sugGoodsCode, 400)
									} else {
										p.imgSrc = Util.getProductImg(p.sugGoodsCode, 200)
									}
									p.prdUrl = Util.getProductUrl(p.sugGoodsCode, p.vendorId)
								})
							});
							var h = template("shopTemp", i.sugGoods[0]);
							g.html(h);
							if (!Swipe) {
								$.loadScript({
									srcArr: [sn_config.channelRes + "/project/mvs/RES/common/script/module/swipe/1.1.0/swipe.js"],
									withoutGa: true,
									loadComplete: function() {
										Home.initSwipe()
									}
								})
							} else {
								Home.initSwipe()
							}
						} catch(j) {}
					}
				}).always(function() {
					c.resolve()
				})
			} else {
				c.resolve()
			}
			return c.promise()
		},
		guessulikeFuc: function() {
			var d = this,
			e = $("#guessulike"),
			c = $("#guessulikeCon");
			e.lazyload(function() {
				if (d.guessResFlag) {
					return
				}
				var h = c.find(".pro-list");
				var g = $.cookie("_snma");
				g && (g = g.split("|")[1]);
				var f = $.cookie("custno") || "";
				if (!g) {
					return
				}
				d.guessResFlag = true;
				$.ajax({
					url: sn_config.tujianDomain + "/recommend-portal/recommendv2/biz.jsonp?u=" + f + "&c=" + g + "&sceneIds=14-1&cityId=" + Setting.cityId + "&count=50",
					dataType: "jsonp",
					cache: true,
					error: function(i, k, j) {},
					success: function(p) {
						if (p == null) {
							e.hide();
							c.hide()
						} else {
							var n = p.sugGoods[0];
							if (n.skus.length == 0) {
								e.hide();
								c.hide();
								return
							}
							var j = 0;
							var l;
							for (var k = 0; k < n.skus.length; k++) {
								j = n.skus[k].sugGoodsCode.length;
								l = n.skus[k].sugGoodsCode.substring(j - 9, j);
								n.skus[k].bigImg = Util.getProductImg(n.skus[k].sugGoodsCode, 200);
								var o = k.toString();
								if (o.length == 1) {
									o = "00" + o
								} else {
									if (o.length == 2) {
										o = "0" + o
									}
								}
								n.skus[k].baoguangName = "baoguang_recwcnxh_1-" + (k + 1) + "_" + (!n.skus[k].vendorId ? "0000000000": n.skus[k].vendorId) + "_" + l + "_01A";
								n.skus[k].name = "waphome_none_recwcnxh_1-" + (k + 1) + "_p_" + (!n.skus[k].vendorId ? "0000000000": n.skus[k].vendorId) + "_" + l + "_01A";
								n.skus[k].href = sn_config.base + "/product/" + (!n.skus[k].vendorId ? "": (n.skus[k].vendorId + "/")) + l + ".html?src=waphome_none_recwcnxh_1-" + (k + 1) + "_p_" + (!n.skus[k].vendorId ? "0000000000": n.skus[k].vendorId) + "_" + l + "_01A"
							}
							var m = template.compile($("#proItemTemp").html());
							h.html(m(n));
							e.show();
							c.show()
						}
					}
				})
			})
		},
		initFooter: function() {
			$("#suningapp").click(function() {
				topDownloadApp()
			});
			$("#suningtopc").click(function() {
				var d = $(this).attr("res-cd");
				document.cookie = "terminal_flag=0;domain=" + (d ? d: ".suning.com") + ";path=/";
				var c = $(this).attr("res-url");
				if (c) {
					b.location.href = c
				} else {
					b.location.href = "http://www.suning.com/?utm_source=suning&utm_medium=pc"
				}
			});
			$("#footerLogin").click(function() {
				b.location.href = sn_config.idsauth_server_url + "/login?service=" + sn_config.idsauth_url + "?targetUrl=" + b.location.href + "&loginTheme=wap_new"
			});
			$("#footerLogout").click(function() {
				b.location.href = sn_config.idsauth_server_url + "/logout?service=" + b.location.href;
				var c = {
					path: "/",
					domain: sn_config.cookieDomain
				};
				$.removeCookie("cartv30", c);
				$.removeCookie("cartv31", c);
				$.removeCookie("checkedItems", c);
				$.removeCookie("mergeFlag", c);
				$.removeCookie("totalCheckedQty", c);
				$.removeCookie("totalProdQtyv3", c);
				$.removeCookie("mtisAbTest", c)
			});
			$("#footerUserName").click(function() {
				b.location.href = sn_config.my
			})
		},
		zsqInit: function() {
			var d = this,
			c = $.Deferred();
			d.zsqInitFlag = true;
			var f = $(".app56");
			if (!f.length == 0) {
				f.find(".l").attr("href", sn_config.juDomain + "/wap/palmrob/outerInit_0_0.htm");
				function e(g) {
					return Setting.IMG_HOST[Util.getEnvName()] + "/uimg/nmps/ZJYDP/" + g + "picA_1_280x210.jpg"
				}
				$.ajax({
					dataType: "jsonp",
					url: sn_config.juDomain + "/wap/palmrob/ajax/getPalmRobInfoByJsonp_0_6_zsqCallback.htm",
					cache: true,
					jsonpCallback: "zsqCallback"
				}).done(function(g) {
					if (!g || !g.commList || !g.commList.length) {
						f.hide();
						return
					}
					$(g.commList).each(function(i, j) {
						j.prdUrl = e(j.attractId.toString() + j.partnumber.toString());
						j.linkUrl = sn_config.juDomain + "/wap/palmrob/outerInit_0_0.htm#" + j.position
					});
					var h = template("zsqItemTemp", g);
					f.find(".items ul").html(h);
					$(b).trigger("scroll");
					Util.getCurrentTime().done(function(i) {
						f.find(".tag").html(g.currentName);
						if (i < g.nextTime) {
							CountDown({
								obj: f.find(".count"),
								startTime: 0,
								endTime: g.nextTime,
								nowTime: i,
								beforeStart: function() {},
								isStart: function() {
									var j = this.gap[3].toString(),
									l = this.gap[2].toString(),
									m = this.gap[1].toString(),
									k = this.gap[0].toString();
									this.obj.html('<span class="hour-node">' + l + '</span>:<span class="minute-node">' + m + '</span>:<span class="second-node">' + k + "</span>")
								},
								callback: function() {
									if (d.zsqInitFlag) {
										Home.zsqInit()
									}
								}
							})
						} else {
							f.find(".count").css("visibility", "hidden")
						}
					});
					f.find(".pro").getProPrice({
						cityCode: Setting.cityCode,
						isDefaultWork: false,
						callback: function(i, j) {
							$(j).each(function(l, n) {
								var k = $(n);
								var m = i[l];
								var o = parseFloat(m.refPrice || m.snPrice);
								o && k.find(".tag-price").html("￥" + o.toFixed(2))
							})
						}
					})
				}).fail(function(h, g) {
					console.log(h, g);
					d.zsqInitFlag = false
				}).always(function() {
					c.resolve()
				})
			} else {
				c.resolve()
			}
			return c.promise()
		},
		zsq1Init: function() {
			var d = this,
			c = $.Deferred();
			d.zsqInitFlag = true;
			var f = $(".v5-zsq");
			if (!f.length == 0) {
				f.find(".r").attr("href", sn_config.juDomain + "/wap/palmrob/outerInit_0_0.htm");
				function e(g) {
					return Setting.IMG_HOST[Util.getEnvName()] + "/uimg/nmps/ZJYDP/" + g + "picA_1_280x210.jpg"
				}
				$.ajax({
					dataType: "jsonp",
					url: sn_config.juDomain + "/wap/palmrob/ajax/getPalmRobInfoByJsonp_0_20_zsqCallback.htm",
					cache: true,
					jsonpCallback: "zsqCallback"
				}).done(function(g) {
					if (!g || !g.commList || !g.commList.length) {
						f.hide();
						return
					}
					$(g.commList).each(function(i, j) {
						j.prdUrl = e(j.attractId.toString() + j.partnumber.toString());
						j.linkUrl = sn_config.juDomain + "/wap/palmrob/outerInit_0_0.htm#" + j.position;
						j.prices = j.gbPrice.split(".")
					});
					var h = template("zsqTemp", g);
					f.find(".items ul").html(h);
					$(b).trigger("scroll");
					Util.getCurrentTime().done(function(i) {
						f.find(".tag").html(g.currentName);
						if (i < g.nextTime) {
							CountDown({
								obj: f.find(".count"),
								startTime: 0,
								endTime: g.nextTime,
								nowTime: i,
								beforeStart: function() {},
								isStart: function() {
									var j = this.gap[3].toString(),
									l = this.gap[2].toString(),
									m = this.gap[1].toString(),
									k = this.gap[0].toString();
									this.obj.html('<span class="hour-node">' + l + '</span>:<span class="minute-node">' + m + '</span>:<span class="second-node">' + k + "</span>")
								},
								callback: function() {
									if (d.zsqInitFlag) {
										Home.zsqInit()
									}
								}
							})
						} else {
							f.find(".count").css("visibility", "hidden")
						}
					});
					f.find(".pro").getProPrice({
						cityCode: Setting.cityCode,
						isDefaultWork: false,
						callback: function(i, j) {
							$(j).each(function(n, p) {
								var k = $(p);
								var o = i[n];
								var m = parseFloat(k.find(".prices").data("gbrice"));
								var q = parseFloat(o.refPrice || o.snPrice);
								q && k.find(".tag-price").html("￥" + q.toFixed(2));
								if (m < q) {
									var l = (m / q * 10).toFixed(1);
									l = l.toString();
									l = l.split(".");
									$(p).find(".sale").html('<i class="f1">' + l[0] + '</i><i class="f2">.</i><i class="f3">' + l[1] + '</i><i class="f4">折</i>')
								}
							})
						}
					})
				}).fail(function(h, g) {
					console.log(h, g);
					d.zsqInitFlag = false
				}).always(function() {
					c.resolve()
				})
			} else {
				c.resolve()
			}
			return c.promise()
		},
		getLogonInfo: function() {
			Util.checkLogin().done(function() {
				Home.checkMergeCart();
				$.ajax({
					url: sn_config.base + "/private/getLogonInfo.do",
					cache: false,
					async: false,
					dataType: "json",
					error: function(c, e, d) {},
					success: function(c) {
						var e = "";
						if (typeof(c.nickName) != "undefined" && c.nickName != "") {
							e = c.nickName
						} else {
							if (typeof(c.userName) != "undefined" && c.userName != "") {
								e = c.userName
							} else {
								e = c.logonId
							}
						}
						if (e.length > 10) {
							var d = e.substring(0, 6) + "...";
							$("#footerUserName").find("span").text(d)
						} else {
							$("#footerUserName").find("span").text(e)
						}
						$("#footerLogin").hide();
						$("#footerRegister").hide();
						$("#shopCartTip").hide();
						$("#footerUserName").show();
						$("#footerLogout").show()
					}
				})
			})
		},
		gaInit: function() {
			var c = $.Deferred();
			_loadScript_.prototype.ga = false;
			var d = device.isApp ? "inapp": "wap";
			document.body.insertAdjacentHTML("beforeend", '<input type="hidden" id="resourceType" value="' + d + '">');
			$.loadScript({
				srcArr: [sn_config.scriptDomianDir + "/javascript/sn_da/sa_click.js", sn_config.scriptDomianDir + "/javascript/sn_da/sa_simple.js"],
				withoutGa: true,
				loadComplete: function() {
					$("body").on("click", "a[name^=index_],a[name^=shouye_none_toubu_],a[name^=wapssjgy_none_],input[name^=index_none]",
					function() {
						sa.click.sendDatasIndex(this)
					});
					$("body").on("click", "a[name^=index_wapshouye01_floor01_]",
					function() {
						if (saCustomDataUtil && typeof(saCustomDataUtil) == "object") {
							saCustomDataUtil.sendData(this)
						}
					});
					if (b.expoTags) {
						_analyseExpoTags("a")
					}
					c.resolve()
				}
			});
			return c.promise()
		},
		checkMergeCart: function() {
			var d = this,
			c = $.Deferred();
			var g = $.cookie("mergeFlag");
			if (typeof g === "undefined" || g != "1") {
				function e() {
					var h = {
						storeId: "10052",
						isMerge: "1",
						supportPackage: "1",
						supportAccePack: "0",
						supportSunPack: "0",
						supportCheck: "1",
						supportCShop: "1",
						supportCShopCheck: "1",
						supportGroupbuy: "1",
						mpsChannel: "5",
						supportXN: "1",
						channel: "5",
						updateWAPCartCookie: "1"
					};
					return $.ajax({
						type: "GET",
						url: sn_config.shopProductServerUrl + "/webapp/wcs/stores/servlet/SNMobileShoppingCartQuery",
						cache: false,
						async: false,
						dataType: "jsonp",
						data: h,
						jsonp: "callback",
						success: function(i) {},
						complete: function() {}
					})
				}
				function f() {
					var h = {
						tempCartId: $.cookie("mtisTempCartId") || "",
						operationTerminal: "01",
						userFlag: "0",
						settlementFlag: "0"
					};
					return $.ajax({
						type: "GET",
						url: sn_config.cartDomain + "/app/cart1/gateway/mergeShoppingCart.do",
						cache: false,
						async: false,
						dataType: "jsonp",
						data: h,
						jsonp: "callback",
						success: function(i) {},
						complete: function() {}
					})
				}
				$.when(e(), f()).then(function() {
					Home.showCartNum();
					c.resolve()
				})
			} else {
				c.resolve()
			}
			return c.promise()
		}
	}
} (window); !
function() {
	var e = navigator.userAgent;
	function f(j) {
		var i = new Date();
		i.setTime(i.getTime() + (24 * 60 * 60 * 1000));
		if (j == "0") {
			$.cookie("_isopenappAd", "flase", {
				path: "/",
				domain: sn_config.cookieDomain,
				expires: i
			})
		} else {
			$.cookie("_isopenapp", "flase", {
				path: "/",
				domain: sn_config.cookieDomain,
				expires: i
			})
		}
	}
	window.topOpenApp = function(p, q, k) {
		var j = "com.suning.SuningEbuy://wapToEbuy?adTypeCode=1001";
		var l = "suning://m.suning.com/index?adTypeCode=1001";
		var i = "";
		if (k == "1") {
			i = "&wap_source=wap-app&wap_medium=shouye"
		} else {
			i = "&wap_source=wap-app&wap_medium=qita"
		}
		if (window.location.href.indexOf("?") > 0) {
			i = i + "&" + (window.location.href).split("?")[1]
		}
		f(q);
		var o = navigator.userAgent;
		function t(u) {
			var v = document.createElement("iframe");
			v.src = u;
			v.style.display = "none";
			document.body.appendChild(v);
			setTimeout(function() {
				document.body.removeChild(v)
			},
			1000)
		}
		if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
			var n = new Date();
			var r = o.match(/(iPhone\sOS)\s([\d]+)/) || o.match(/(iPad).*OS\s([\d_]+)/) || o.match(/(iPod)(.*OS\s([\d_]+))?/);
			var m = parseInt(r[2], 10);
			if (m >= 9) {
				window.location.href = j + i
			} else {
				t(j + i)
			}
			if (q == "0") {
				var n = new Date();
				window.setTimeout(function() {
					var u = new Date();
					if (u - n < 5000) {
						window.location.href = p
					} else {
						window.close()
					}
				},
				1200)
			}
		} else {
			if (navigator.userAgent.match(/android/i)) {
				t(l + i);
				if (q == "0") {
					var s = true;
					window.onblur = function() {
						s = false
					};
					setTimeout(function() {
						if (s) {
							window.location.href = p
						}
					},
					1200)
				}
			} else {}
		}
	};
	if (sn_config.homeOpenappOnOff == "1") {
		if ($.cookie("_isopenapp") == undefined) {
			var b = new Date();
			b.setTime(b.getTime() + (24 * 60 * 60 * 1000));
			$.cookie("_isopenapp", "true", {
				path: "/",
				domain: sn_config.cookieDomain,
				expires: b
			});
			topOpenApp("", "1", "1")
		} else {
			if ($.cookie("_isopenapp") == "true") {
				topOpenApp("", "1", "1")
			}
		}
	}
	function h(k) {
		var m = k ? k: window.location.search.replace(/^\?/, "");
		var j = {};
		if (m) {
			var o = m.split("&");
			for (var l = 0; l < o.length; l++) {
				o[l] = o[l].split("=");
				try {
					j[o[l][0]] = decodeURIComponent(o[l][1])
				} catch(n) {
					j[o[l][0]] = o[l][1]
				}
			}
		}
		return j
	}
	var a;
	var g = h()["popup"];
	if (g && g == 0) {
		a = true
	}
	window.topDownloadApp = function(m, r) {
		var i = "com.suning.SuningEbuy://";
		var j = "suning://m.suning.com/index";
		var n = navigator.userAgent;
		if (m) {
			i += "wapToEbuy?adTypeCode=1002&adId=" + m;
			j += "?adTypeCode=1002&adId=" + m
		}
		function q(s) {
			var t = document.createElement("iframe");
			t.src = s;
			t.style.display = "none";
			document.body.appendChild(t);
			setTimeout(function() {
				document.body.removeChild(t)
			},
			1000)
		}
		if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
			var l = new Date();
			var o = n.match(/(iPhone\sOS)\s([\d]+)/) || n.match(/(iPad).*OS\s([\d_]+)/) || n.match(/(iPod)(.*OS\s([\d_]+))?/);
			var k = parseInt(o[2], 10);
			if (k >= 9) {
				window.location.href = i
			} else {
				q(i)
			}
			var p = true;
			window.onblur = function() {
				p = false
			};
			window.setTimeout(function() {
				var s = new Date();
				if (s - l < 5000 && p) {
					if (navigator.userAgent.match(/MicroMessenger/i)) {
						window.location.href = "http://code.suning.cn/g~raou";
						return
					}
					if (r) {
						window.location.href = "http://code.suning.cn/g~raou"
					} else {
						window.location.href = "http://code.suning.cn/g~raou"
					}
				} else {
					window.close()
				}
			},
			1200)
		} else {
			if (navigator.userAgent.match(/android/i)) {
				q(j);
				if (navigator.userAgent.match(/MicroMessenger/i)) {
					window.location.href = "http://code.suning.cn/g~raou";
					return
				}
				var p = true;
				window.onblur = function() {
					p = false
				};
				setTimeout(function() {
					if (p) {
						if (r) {
							window.location.href = "http://code.suning.cn/g~raou"
						} else {
							window.location.href = "http://code.suning.cn/g~raou"
						}
					}
				},
				1200)
			}
		}
	};
	var d = $(".f-l-o-a-t-s-a-l-e"),
	c = d.find("img");
	if (d.length > 0) {
		if ($.cookie("_isshowfloatad") == undefined) {
			var b = new Date();
			b.setTime(b.getTime() + (24 * 60 * 60 * 1000));
			$.cookie("_isshowfloatad", "true", {
				path: "/",
				domain: sn_config.cookieDomain,
				expires: b
			});
			if (!a) {
				d.show();
				if (c.attr("data-src")) {
					c.attr("src", c.attr("data-src"))
				}
			}
		} else {
			if ($.cookie("_isshowfloatad") == "true") {
				if (!a) {
					d.show();
					if (c.attr("data-src")) {
						c.attr("src", c.attr("data-src"))
					}
				}
			} else {
				d.remove()
			}
		}
		window.closeFloatad = function(j) {
			j.parentNode.parentNode.style.display = "none";
			var i = new Date();
			i.setTime(i.getTime() + (24 * 60 * 60 * 1000));
			$.cookie("_isshowfloatad", "flase", {
				path: "/",
				domain: sn_config.cookieDomain,
				expires: i
			})
		};
		if ($.cookie("_isshowfloatad") != "true") {
			$("." + sn_config.dlCls).find(".click").on("click",
			function() {
				topDownloadApp()
			})
		} else {
			$("." + sn_config.dlCls).hide()
		}
	}
} ();
$(function() {
	Home.pageInit();
	setTimeout(Home.gaInit, 900);
	Home.zsq1Init().then(Home.widgetInit).then(Home.keyWordInit).then(Home.recommandShopsInit).then(function() {
		Home.getLogonInfo();
		Home.hotMarktInit();
		Home.geoInit()
	})
});