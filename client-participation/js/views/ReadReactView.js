// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

var eb = require("../eventBus");
var Backbone = require("backbone");
var Handlebones = require("handlebones");

var template = require("../templates/readReactView.handlebars");
var CommentModel = require("../models/comment");
var VoteView = require('../views/vote-view');
var CommentFormView = require("../views/comment-form");
var PolisFacebookUtils = require('../util/facebookButton');
// var serverClient = require("../stores/polis");
// var Utils = require("../util/utils");

// var iOS = Utils.isIos();

// if this changes, be sure to check for the presence of Constants.FB_APP_ID as well:
var SHOULD_PROMPT_FOR_FB = false;

module.exports = Handlebones.ModelView.extend({
  name: "readReactView",
  template: template,
  mode: "voting",
  events: {

    "click #fbNotNowBtn": "fbNotNowBtn",
    "click #fbNoUseBtn": "fbNoUseBtn",
    "click #fbConnectBtn": "fbConnectBtn",
    "click #switchBetweenCommentsAndVotingButton": "switchBetweenCommentsAndVotingButton",
    // "click #passButton": "participantPassed",

  },
  fbNotNowBtn: function() {
    this.model.set("response", "fbnotnow");
  },
  fbNoUseBtn: function() {
    this.model.set("response", "fbnouse");
  },
  fbConnectBtn: function() {
    PolisFacebookUtils.connect().then(function() {
      // that.model.set("response", "fbdone");
      location.reload();
    }, function(err) {
      // alert("facebook error");
    });
  },
  switchBetweenCommentsAndVotingButton: function() {
    if (this.mode === "comments") {
      this.mode = "voting";
    } else {
      this.mode = "comments";
    }

    this.render();
  },

  context: function() {
    var ctx = Handlebones.ModelView.prototype.context.apply(this, arguments);
    // ctx.iOS = iOS;
    var hasFacebookAttached = window.userObject.hasFacebook;

    var voteCountForFacebookPrompt = 3;

    ctx.promptFacebook = SHOULD_PROMPT_FOR_FB && !hasFacebookAttached && !this.model.get("response") && this.model.get("voteCount") > voteCountForFacebookPrompt;

    ctx.showingComments = this.mode === "comments";
    ctx.no_write = this.noWrite;
    return ctx;
  },

  initialize: function(options) {
    Handlebones.ModelView.prototype.initialize.apply(this, arguments);
    var that = this;
    this.model = options.model;

    this.noWrite = options.noWrite;

    this.voteView = this.addChild(new VoteView({
      firstCommentPromise: options.firstCommentPromise,
      serverClient: options.serverClient,
      model: new CommentModel(),
      conversationModel: options.conversationModel,
      votesByMe: options.votesByMe,
      is_public: options.is_public,
      isSubscribed: options.isSubscribed,
      conversation_id: options.conversation_id
    }));

    this.commentForm = this.addChild(new CommentFormView({
      model: new Backbone.Model({}),
      conversationModel: options.conversationModel,
      serverClient: options.serverClient,
      conversation_id: options.conversation_id,
      wipCommentFormText: options.wipCommentFormText
    }));

    this.commentForm.on("commentSubmitted", function() {
      // $("#"+VOTE_TAB).tab("show");
    });

    eb.on("vote", function() {
      that.model.set("voteCount", (that.model.get("voteCount") + 1) || 1);
    });
  }
});
