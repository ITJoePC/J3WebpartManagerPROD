"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * homepage.js
 * @author John W. Westhuis
 */

function ShowBody(el, selector) {
    var parent = el.parentElement;
    var body = parent.querySelector(selector);
    if (body.style.display === "none") {
        body.style.display = "block";
        el.classList.add("active");
    } else {
        body.style.display = "none";
        el.classList.remove("active");
    }
}

(function () {

    var appWebUrl = _spPageContextInfo.webAbsoluteUrl + '/';

    console.info('Home Page | Start Creation.....');
    getListItem("Layout", "?$orderby=WebpartOrder").then(function (webparts) {
        // console.log("success", webparts);
        var leftGroup = document.getElementById("left-group");
        var rightGroup = document.getElementById("right-group");

        webparts.forEach(function (webpart) {
            var el = BuildWebPart(webpart.WebpartType);
            if (webpart.WebpartSide === "LeftSide") leftGroup.append(el);else rightGroup.append(el);
        });
    }).catch(function (e) {
        console.log("error", e);
    });

    function BuildWebPart(type) {

        var div = document.createElement("div");

        getListItem(type).then(function (webpartData) {

            if (!webpartData.length) {
                console.log("no data found for " + type);
                return div;
            }

            if (type === "WebpartContent") {
                // console.log("Creating Title", webpartData)
                div.innerHTML = "<div class=\"title-group component-group\">\n                        \n                    </div>";
                webpartData.forEach(function (data) {
                    var ContentTitle = data.ContentTitle;
                    var SubTitle = data.SubTitle;


                    var el = div.querySelector(".title-group");
                    el.innerHTML = el.innerHTML + ("<div class=\"main-title mt-3 bold\">" + ContentTitle + "</div>\n                        <div class=\"sub-title\">" + (SubTitle || '') + "</div>\n                        <hr>");
                });
            } else if (type === "Carousel") {
                // console.log("Creating Carousel", webpartData)
                div.innerHTML = "<style>\n                        .carousel-control-next-icon,\n                        .carousel-control-prev-icon {\n                            width: 7rem;\n                            height: 7rem;\n                        }\n                    </style>\n                    <div class=\"carousel-group component-group\">\n                        <div id=\"myCarousel\" class=\"carousel slide pointer-event\" data-bs-ride=\"carousel\">\n\n                            <!-- carousel-indicators -->\n                            <div class=\"carousel-indicators\">\n                            </div>\n\n                            <!-- carousel-inner -->\n                            <div class=\"carousel-inner\">\n                                \n                                \n                            </div>\n                        </div>\n                    </div>";

                webpartData.forEach(function (data, index) {
                    var ImageURL = data.ImageURL;
                    var LinkURL = data.LinkURL;
                    var LinkText = data.LinkText;

                    //carousel indicators

                    if (index == 0) {
                        var indicator = div.querySelector(".carousel-indicators");
                        indicator.innerHTML = indicator.innerHTML + "<button type=\"button\" data-bs-target=\"#myCarousel\" data-bs-slide-to=\"0\" aria-label=\"Slide 1\" class=\"active\" aria-current=\"true\"></button>";

                        //carousel slides
                        var carousel = div.querySelector(".carousel-inner");
                        carousel.innerHTML = carousel.innerHTML + (" <div class=\"carousel-item active\" data-bs-interval=\"4000\">\n                                <img src=\"" + ImageURL + "\"\n                                    width=\"100%\" height=\"350\">\n                                " + (LinkText ? "<div class=\"container\">\n                                        " + (LinkURL ? "<a href=\"" + LinkURL + "\"><div class=\"carousel-caption text-start\">" + LinkText + "</div> </a>" : "<div class=\"carousel-caption text-start\">" + LinkText + "</div>") + "\n                                    </div>" : "") + "\n                            </div>");
                    } else {
                        var _indicator = div.querySelector(".carousel-indicators");
                        _indicator.innerHTML = _indicator.innerHTML + ("<button type=\"button\" data-bs-target=\"#myCarousel\" data-bs-slide-to=\"" + index + "\" aria-label=\"Slide " + (index + 1) + "\"></button>");

                        //carousel slides
                        var _carousel = div.querySelector(".carousel-inner");
                        _carousel.innerHTML = _carousel.innerHTML + (" <div class=\"carousel-item\" data-bs-interval=\"4000\">\n                                    <img src=\"" + ImageURL + "\"\n                                        width=\"100%\" height=\"350\">\n                                        " + (LinkText ? "<div class=\"container\">\n                                                " + (LinkURL ? "<a href=\"" + LinkURL + "\"><div class=\"carousel-caption text-start\">" + LinkText + "</div> </a>" : "<div class=\"carousel-caption text-start\">" + LinkText + "</div>") + "\n                                            </div>" : "") + "\n                                </div>");
                    }
                });

                //add the buttons
                var el = div.querySelector(".carousel-inner");
                el.innerHTML = el.innerHTML + "<button class=\"carousel-control-prev\" type=\"button\" data-bs-target=\"#myCarousel\" data-bs-slide=\"prev\">\n                        <span class=\"carousel-control-prev-icon\" aria-hidden=\"true\"></span>\n                        <span class=\"visually-hidden\">Previous</span>\n                    </button>\n                    <button class=\"carousel-control-next\" type=\"button\" data-bs-target=\"#myCarousel\" data-bs-slide=\"next\">\n                        <span class=\"carousel-control-next-icon\" aria-hidden=\"true\"></span>\n                        <span class=\"visually-hidden\">Next</span>\n                    </button>";

                new bootstrap.Carousel(document.querySelector('#myCarousel'), {
                    interval: 2000,
                    wrap: true
                });
            } else if (type === "ContentElement") {

                // console.log("Creating Content", webpartData)
                div.innerHTML = "<div class=\"text-group component-group\">\n                        \n                    </div>";
                webpartData.forEach(function (data) {
                    var ContentTitle = data.ContentTitle;
                    var Description = data.Description;


                    var el = div.querySelector(".text-group");
                    el.innerHTML = el.innerHTML + ("<div class=\"text-header\">" + (ContentTitle || "") + "</div>\n                        <div class=\"text-body container\">" + (Description || "") + "</div>");
                });
            } else if (type === "Staff") {

                //Leader
                // console.log("Creating Staff", webpartData)
                var MainPOC = webpartData.filter(function (data) {
                    return !!data.MainPOC;
                });
                if (!!MainPOC.length) {

                    div.innerHTML = div.innerHTML + "<div class=\"director-group component-group\"><!-- Director -->\n    \n                        </div>";

                    MainPOC.forEach(function (data) {
                        var UserTitle = data.UserTitle;
                        var UserEmail = data.UserEmail;
                        var Phone = data.Phone;
                        var JobTitle = data.JobTitle;
                        var ImageURL = data.ImageURL;
                        var LeadershipBioURL = data.LeadershipBioURL;


                        var el = div.querySelector(".director-group");
                        el.innerHTML = el.innerHTML + ("<div class=\"director-text\" style=\"border-radius: 1rem!important;\">\n                                <div class=\"director-image\">\n                                    <div class=\"director-image-circle float-start\" style=\"background-color: white;background-image: url('" + (ImageURL ? ImageURL : appWebUrl + "_layouts/images/O14_person_placeHolder_192.png") + "')\"></div>\n                                </div>\n                                <div class=\"director-title component-title\">" + (JobTitle || "") + "</div>\n                                <div class=\"director-name bold\">" + (UserTitle || "") + "\n                                " + (LeadershipBioURL ? "<a class=\"badge rounded-pill text-bg-primary\" style=\"margin-left: 8px;\" href=\"" + LeadershipBioURL + "\">View Bio</a>" : "") + "\n                                </div>\n                                " + (Phone ? "<div class=\"director-phone\">\n                                <span class=\"\" style=\"padding: 3px !important;border-radius: 50% !important;display: inline-flex;margin-right: 6px;\">\n                                    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-telephone-outbound-fill poc\" viewBox=\"0 0 16 16\">\n                                        <path fill-rule=\"evenodd\" d=\"M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511zM11 .5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-4.146 4.147a.5.5 0 0 1-.708-.708L14.293 1H11.5a.5.5 0 0 1-.5-.5z\"></path>\n                                    </svg>\n                                </span>\n                                <span class=\"pb-1\">" + Phone + "</span>\n                            </div>" : "") + "\n                                " + (UserEmail ? " <div class=\"director-email\">\n                                <span class=\"\" style=\"padding: 3px !important;border-radius: 50% !important;display: inline-flex;margin-right: 6px;\">\n                                    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-envelope-plus poc\" viewBox=\"0 0 16 16\">\n                                            <path d=\"M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2H2Zm3.708 6.208L1 11.105V5.383l4.708 2.825ZM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2-7-4.2Z\"></path>\n                                            <path d=\"M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-3.5-2a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1v-1a.5.5 0 0 0-.5-.5Z\"></path>\n                                        </svg>\n                                </span>\n                                <a class=\"pb-1\" id=\"send-email-main\" href=\"mailto:" + UserEmail + "\">" + UserEmail + "</a>\n                                <a class=\"pb-1\" id=\"send-email-sub\" href=\"mailto:" + UserEmail + "\">Send Email</a>\n                            </div>" : "") + "\n                               \n                            </div>");
                    });
                }

                //Rest of Staff

                var Staff = webpartData.filter(function (data) {
                    return !data.MainPOC;
                });
                Staff.sort(function (a, b) {
                    return a.SortOrder - b.SortOrder;
                });
                if (!!Staff.length) {

                    div.innerHTML = div.innerHTML + "<div class=\"staff-group component-group\"><!-- Director -->\n                            <div class=\"poc-title component-title px-3\" style=\"border-bottom-right-radius: 1rem !important;\">Points of Contact</div>\n                        </div>";

                    Staff.forEach(function (data) {
                        var UserTitle = data.UserTitle;
                        var UserEmail = data.UserEmail;
                        var Phone = data.Phone;
                        var JobTitle = data.JobTitle;


                        var el = div.querySelector(".staff-group");
                        el.innerHTML = el.innerHTML + ("<div class=\"card card-body border-0 mb-1 text-left body-text\" style=\"border-radius: 1.25rem!important;\"><!-- Example POC -->\n                                <!-- Title -->\n                                <div class=\"text-j3blue text-start\"><strong>" + (JobTitle || "") + "</strong></div>\n                                <!-- User Title -->\n                                <div class=\"bold\">" + (UserTitle || "") + "</div>\n                                <!-- User Phone -->\n\n                                " + (Phone ? "<div>\n                                <span class=\"\" style=\"padding: 3px !important;border-radius: 50% !important;display: inline-flex;\">\n                                    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-telephone-outbound-fill poc\" viewBox=\"0 0 16 16\">\n                                        <path fill-rule=\"evenodd\" d=\"M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511zM11 .5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-4.146 4.147a.5.5 0 0 1-.708-.708L14.293 1H11.5a.5.5 0 0 1-.5-.5z\"></path>\n                                    </svg>\n                                </span>\n                                <span class=\"pb-1\">" + Phone + "</span>\n                             </div>" : "") + "\n                               \n                                <!-- User Email -->\n\n                                " + (UserEmail ? "\n                                <div>\n                                    <span class=\"\" style=\"padding: 3px !important;border-radius: 50% !important;display: inline-flex;\">\n                                        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-envelope-plus poc\" viewBox=\"0 0 16 16\">\n                                            <path d=\"M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2H2Zm3.708 6.208L1 11.105V5.383l4.708 2.825ZM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2-7-4.2Z\"></path>\n                                            <path d=\"M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-3.5-2a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1v-1a.5.5 0 0 0-.5-.5Z\"></path>\n                                        </svg>\n                                    </span>\n                                    <a class=\"pb-1\" href=\"mailto:" + UserEmail + "\">" + UserEmail + "</a>\n                                </div>\n                            " : "") + "\n\n\n                                <div>\n                                    \n                                    \n                                </div>\n                            </div>");
                    });
                }
            } else if (type === "Announcements") {

                // console.log("Creating Announcements", webpartData)
                div.innerHTML = "<div class=\"announcement-group component-group\">\n                        <div class=\"announcement-title component-title\">Announcements</div>\n                        <div class=\"announcement-body\">\n\n                            \n\n                        </div>\n                    </div>";
                webpartData.forEach(function (data) {
                    var AnnouncementTitle = data.AnnouncementTitle;
                    var Body = data.Body;
                    var EventDate = data.EventDate;
                    var Expires = data.Expires;


                    if (!Expires || new Date() <= new Date(Expires)) {
                        var _el = div.querySelector(".announcement-body");
                        _el.innerHTML = _el.innerHTML + ("<div class=\"announcement-item card card-body border-0 text-left body-text\">\n                                <div class=\"announcement-header component-title\" onclick=ShowBody(this,'.announcement-text-body')>\n                                    <div class=\"announcement-title\">" + AnnouncementTitle + "</div>\n                                    <div class=\"announcement-text\">" + (EventDate ? new Date(EventDate).toDateString() : "") + "</div>\n                                </div>\n                                <div class=\"announcement-text-body\" style=\"display:none\">" + (Body || "") + "</div>\n                            </div>");
                    }
                });
            } else if (type === "Events") {

                // console.log("Creating Events", webpartData)
                div.innerHTML = "<div class=\"event-group component-group\">\n                        <div class=\"event-title component-title\">Events</div>\n                        <div class=\"event-body\">\n\n                            \n\n                        </div>\n                    </div>";
                webpartData.forEach(function (data) {
                    var EventTitle = data.EventTitle;
                    var Body = data.Body;
                    var EventDate = data.EventDate;
                    var Expires = data.Expires;


                    if (!Expires || new Date() <= new Date(Expires)) {
                        var _el2 = div.querySelector(".event-body");
                        _el2.innerHTML = _el2.innerHTML + ("<div class=\"event-item card card-body border-0 text-left body-text\">\n                                <div class=\"event-header component-title\" onclick=ShowBody(this,'.event-text-body')>\n                                    <div class=\"event-title\">" + (EventTitle ? EventTitle : "") + "</div>\n                                    <div class=\"event-text\">" + (EventDate ? new Date(EventDate).toDateString() : "") + "</div>\n                                </div>\n                                <div class=\"event-text-body\" style=\"display:none\">" + (Body ? Body : "") + "</div>\n                            </div>");
                    }
                });
            } else if (type === "MainLinks") {

                // console.log("Creating MainLinks", webpartData)
                div.innerHTML = "<div class=\"buttons-group component-group mt-4 px-3 d-flex justify-content-center\">\n            \n                    </div>";
                webpartData.forEach(function (data) {
                    var MainLinkTitle = data.MainLinkTitle;
                    var LinkURL = data.LinkURL;


                    var el = div.querySelector(".buttons-group");
                    el.innerHTML = el.innerHTML + ("<a class=\"btn btn-custom btn w-100\" href=\"" + (LinkURL ? LinkURL : "#") + "\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\"\n                                class=\"bi bi-link-45deg\" viewBox=\"0 0 16 16\">\n                                <path\n                                    d=\"M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z\">\n                                </path>\n                                <path\n                                    d=\"M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z\">\n                                </path>\n                            </svg>\n                            " + MainLinkTitle + "\n                        </a>");
                });
            } else if (type === "BranchLinks") {

                // console.log("Creating BranchLinks", webpartData)
                div.innerHTML = "<div class=\"BranchLinks-group component-group mt-4 px-3 d-flex\">\n            \n                    </div>";
                webpartData.forEach(function (data) {
                    var BranchLinkTitle = data.BranchLinkTitle;
                    var BranchIcon = data.BranchIcon;
                    var LinkURL = data.LinkURL;


                    var icon = void 0;
                    if (BranchIcon === "File") icon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" fill=\"currentColor\" class=\"bi bi-file-earmark-text\" viewBox=\"0 0 16 16\">\n                                                        <path d=\"M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z\"></path>\n                                                        <path d=\"M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z\"></path>\n                                                    </svg>";else if (BranchIcon === "Folder") icon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" fill=\"currentColor\" class=\"bi bi-folder\" viewBox=\"0 0 16 16\">\n                                                            <path d=\"M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4H2.19zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707z\"></path>\n                                                        </svg>";else if (BranchIcon === "MapMarker") icon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" fill=\"currentColor\" class=\"bi bi-geo-alt-fill\" viewBox=\"0 0 16 16\">\n                                                            <path d=\"M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z\"></path>\n                                                        </svg>";else if (BranchIcon === "Binoculars") icon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" fill=\"currentColor\" class=\"bi bi-binoculars\" viewBox=\"0 0 16 16\">\n                                                                <path d=\"M3 2.5A1.5 1.5 0 0 1 4.5 1h1A1.5 1.5 0 0 1 7 2.5V5h2V2.5A1.5 1.5 0 0 1 10.5 1h1A1.5 1.5 0 0 1 13 2.5v2.382a.5.5 0 0 0 .276.447l.895.447A1.5 1.5 0 0 1 15 7.118V14.5a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 14.5v-3a.5.5 0 0 1 .146-.354l.854-.853V9.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v.793l.854.853A.5.5 0 0 1 7 11.5v3A1.5 1.5 0 0 1 5.5 16h-3A1.5 1.5 0 0 1 1 14.5V7.118a1.5 1.5 0 0 1 .83-1.342l.894-.447A.5.5 0 0 0 3 4.882V2.5zM4.5 2a.5.5 0 0 0-.5.5V3h2v-.5a.5.5 0 0 0-.5-.5h-1zM6 4H4v.882a1.5 1.5 0 0 1-.83 1.342l-.894.447A.5.5 0 0 0 2 7.118V13h4v-1.293l-.854-.853A.5.5 0 0 1 5 10.5v-1A1.5 1.5 0 0 1 6.5 8h3A1.5 1.5 0 0 1 11 9.5v1a.5.5 0 0 1-.146.354l-.854.853V13h4V7.118a.5.5 0 0 0-.276-.447l-.895-.447A1.5 1.5 0 0 1 12 4.882V4h-2v1.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V4zm4-1h2v-.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5V3zm4 11h-4v.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5V14zm-8 0H2v.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5V14z\"></path>\n                                                            </svg>";else if (BranchIcon === "OrgChart") icon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" fill=\"currentColor\" class=\"bi bi-diagram-3\" viewBox=\"0 0 16 16\">\n                                                            <path fill-rule=\"evenodd\" d=\"M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 2 7h5.5V6A1.5 1.5 0 0 1 6 4.5v-1zM8.5 5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1zM0 11.5A1.5 1.5 0 0 1 1.5 10h1A1.5 1.5 0 0 1 4 11.5v1A1.5 1.5 0 0 1 2.5 14h-1A1.5 1.5 0 0 1 0 12.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zm4.5.5A1.5 1.5 0 0 1 7.5 10h1a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zm4.5.5a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1z\"></path>\n                                                        </svg>";else if (BranchIcon === "ClipBoard") icon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" fill=\"currentColor\" class=\"bi bi-clipboard2-check\" viewBox=\"0 0 16 16\">\n                                                                <path d=\"M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5h3Z\"></path>\n                                                                <path d=\"M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-12Z\"></path>\n                                                                <path d=\"M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3Z\"></path>\n                                                            </svg>";else icon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" fill=\"currentColor\" class=\"bi bi-box-arrow-up-right\" viewBox=\"0 0 16 16\">\n                                <path fill-rule=\"evenodd\" d=\"M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z\"/>\n                                <path fill-rule=\"evenodd\" d=\"M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z\"/>\n                                </svg>";

                    var el = div.querySelector(".BranchLinks-group");
                    el.innerHTML = el.innerHTML + ("<a class=\"branchLink\" class=\"\" href=\"" + (LinkURL ? LinkURL : "#") + "\">\n                            <div class=\"branchLinks-icon\">" + icon + "</div>\n                            <div class=\"branchLinks-text\">" + (BranchLinkTitle || "") + "</div>\n                        </a>");
                });
            } else if (type === "ContactInfo") {

                // console.log("Creating Contact Info", webpartData)
                div.innerHTML = "<div class=\"contact-info-group component-group\">\n                        <div class=\"contact-info-title component-title\">Contact Information</div>\n                        <div class=\"contact-info-body\">\n                        \n                    </div>";
                webpartData.forEach(function (data) {
                    var ContactInfo = data.ContactInfo;
                    var ContactIcon = data.ContactIcon;
                    var ContactTitle = data.ContactTitle;

                    var icon = void 0;
                    if (ContactIcon === "Phone") {
                        icon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-telephone-outbound-fill poc\" viewBox=\"0 0 16 16\">\n                                    <path fill-rule=\"evenodd\" d=\"M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511zM11 .5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-4.146 4.147a.5.5 0 0 1-.708-.708L14.293 1H11.5a.5.5 0 0 1-.5-.5z\"></path>\n                                </svg>";
                    } else if (ContactIcon === "Email") {
                        icon = " <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-envelope-plus poc\" viewBox=\"0 0 16 16\">\n                                    <path d=\"M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2H2Zm3.708 6.208L1 11.105V5.383l4.708 2.825ZM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2-7-4.2Z\"></path>\n                                    <path d=\"M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-3.5-2a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1v-1a.5.5 0 0 0-.5-.5Z\"></path>\n                                </svg>";
                    }

                    var el = div.querySelector(".contact-info-body");
                    el.innerHTML = el.innerHTML + ("\n                        <div class=\"contact-info-item\">\n                        " + (icon ? "<span class=\"contact-icon\" style=\"padding: 3px !important;border-radius: 50% !important;display: inline-flex;margin-right: 6px;\">" + icon + "</span>" : "") + "\n                            \n                            <span class=\"contact-title pb-1\">" + (ContactTitle || "") + ": </span>\n                            <span class=\"contact-info pb-1\">" + (ContactInfo || "") + " </span>\n                        </div>");
                });
            } else if (type === "Clocks") {

                console.log("Creating Clocks", webpartData);

                div.innerHTML = "<div class=\"clock-group component-group\">\n                        <div class=\"clock-title component-title\">Time Zones</div>\n                        <div class=\"clock-body row\"></div>\n                    </div>";
                webpartData.forEach(function (data) {
                    var TimeZone = data.TimeZone;
                    var DisplayTitle = data.DisplayTitle;
                    var CustomTheme = data.CustomTheme;
                    var CustomShape = data.CustomShape;

                    var NOW = void 0;
                    var clock = document.createElement("div");
                    clock.classList.add("clock");
                    clock.classList.add("clock-theme-" + CustomTheme);
                    clock.classList.add("clock-" + CustomShape);
                    if (CustomTheme) clock.classList.add("clock-theme-" + CustomTheme);
                    // else console.info(CustomTheme);
                    clock.innerHTML = "<div class=\"clock__second\"></div>\n                                        <div class=\"clock__minute\"></div>\n                                        <div class=\"clock__hour\"></div>\n                                        <div class=\"clock__axis\"></div>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>\n                                        <section class=\"clock__indicator\"></section>";

                    var currentSec = getSecondsToday();
                    var seconds = currentSec / 60 % 1;
                    var minutes = currentSec / 3600 % 1;
                    var hours = currentSec / 43200 % 1;
                    setTime(60 * seconds, "second");
                    setTime(3600 * minutes, "minute");
                    setTime(43200 * hours, "hour");

                    function setTime(left, hand) {
                        return clock.querySelector(".clock__" + hand).setAttribute("style", "animation-delay:" + left * -1 + "s");
                    }

                    function getDateByTimeZone(TimeZone) {

                        var DateObject = new Date();
                        var DateString = DateObject.toLocaleDateString(undefined, {
                            timeZone: TimeZone
                        });

                        var TimeZoneString = DateObject.toLocaleTimeString(undefined, {
                            hour12: false,
                            timeZone: TimeZone
                        });

                        var getHoursMinSeconds = function getHoursMinSeconds(TimeStr) {
                            var _TimeStr$split$0$spli = TimeStr.split(' ')[0].split(':');

                            var _TimeStr$split$0$spli2 = _slicedToArray(_TimeStr$split$0$spli, 3);

                            var hours = _TimeStr$split$0$spli2[0];
                            var min = _TimeStr$split$0$spli2[1];
                            var seconds = _TimeStr$split$0$spli2[2];

                            return {
                                hours: hours,
                                min: min,
                                seconds: seconds
                            };
                        };

                        var _getHoursMinSeconds = getHoursMinSeconds(TimeZoneString);

                        var hours = _getHoursMinSeconds.hours;
                        var min = _getHoursMinSeconds.min;
                        var seconds = _getHoursMinSeconds.seconds;

                        var isAM = Number(hours) < 12;
                        var now = new Date(DateString);
                        now.setHours(Number(hours));
                        now.setMinutes(Number(min));
                        now.setSeconds(Number(seconds));

                        return {
                            now: now,
                            DateString: DateString,
                            TimeZoneString: TimeZoneString,
                            hours: hours,
                            min: min,
                            seconds: seconds,
                            isAM: isAM
                        };
                    }

                    function getSecondsToday(Timezone) {

                        var DateObject = getDateByTimeZone(TimeZone);
                        var TimeZoneString = new Date().toLocaleTimeString(undefined, {
                            hour12: false,
                            timeZone: TimeZone
                        });

                        var isAM = DateObject.isAM;

                        var now = new Date();
                        NOW = DateObject.now; // Sets global variable since we need it in the div.clock-Title below;
                        clock.setAttribute('data-day', isAM ? 'AM' : 'PM');
                        clock.setAttribute('data-time-zone', TimeZone);
                        clock.setAttribute('data-time', TimeZoneString);
                        clock.StartDateObject = DateObject;
                        clock.getDateByTimeZone = getDateByTimeZone;

                        now = DateObject.now;

                        var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        var diff = now - today;
                        return Math.round(diff / 1000);
                    }

                    var clockTitle = document.createElement('div');
                    clockTitle.classList = 'clock-Title text-center';
                    clockTitle.innerHTML = "\n                    <div>" + DisplayTitle + "</div>\n                    <div>" + NOW.format('MM/dd/yyyy <br> hh:mm:ss') + "</div>";

                    var el = div.querySelector(".clock-body");
                    var ClockOuterEl = document.createElement('div');
                    ClockOuterEl.classList = 'clock-outer col';
                    ClockOuterEl.append(clock);
                    ClockOuterEl.appendChild(clockTitle);
                    el.append(ClockOuterEl);

                    setInterval(function () {
                        var _clock$getDateByTimeZ = clock.getDateByTimeZone(clock.dataset.timeZone);

                        var now = _clock$getDateByTimeZ.now;
                        var isAM = _clock$getDateByTimeZ.isAM;

                        clock.setAttribute('data-day', isAM ? 'AM' : 'PM');
                        clockTitle.innerHTML = /*html*/"\n                        <div>" + DisplayTitle + "</div>\n                        <div>" + now.format('MM/dd/yyyy <br> H:mm:ss') + "</div>";
                    }, 1000);
                });
            }
        }).catch(function (e) {
            console.log("Error getting webpart list: \n", e);
        });

        return div;
    }

    function getListItem(listName, filter) {
        return new Promise(function (resolve, reject) {
            var url = appWebUrl + ("_api/web/lists/getByTitle('" + listName + "')/items") + (filter ? filter : "");
            fetch(url, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                    "Accept": "application/json; odata=verbose"
                }
            }).then(function (data) {
                return data.json();
            }).then(function (data) {
                return resolve(data.d.results);
            }).catch(function (e) {
                return reject(e);
            });
        });
    }
})();