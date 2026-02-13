import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Content Types
  type PostStatus = {
    #draft;
    #published;
  };

  type RecruitmentPostType = {
    #recruitmentForm;
    #admitCard;
    #result;
    #answerKey;
  };

  type KeyValue = {
    key : Text;
    value : Text;
  };

  type RecruitmentPost = {
    id : Nat;
    postType : RecruitmentPostType;
    title : Text;
    organization : Text;
    examPostName : Text;
    importantDates : [KeyValue];
    eligibility : Text;
    applicationFee : Text;
    ageLimit : Text;
    vacancyDetails : Text;
    officialLinks : [KeyValue];
    status : PostStatus;
    tags : [Text];
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  module RecruitmentPost {
    public func compare(a : RecruitmentPost, b : RecruitmentPost) : Order.Order {
      Int.compare(b.createdAt, a.createdAt);
    };
  };

  var nextId = 0;
  let posts = Map.empty<Nat, RecruitmentPost>();

  // ADMIN API (protected)
  public shared ({ caller }) func createPost(postType : RecruitmentPostType, title : Text, organization : Text, examPostName : Text, importantDates : [KeyValue], eligibility : Text, applicationFee : Text, ageLimit : Text, vacancyDetails : Text, officialLinks : [KeyValue], tags : [Text]) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create posts");
    };

    let timestamp = Time.now();
    let id = nextId;
    nextId += 1;

    let post : RecruitmentPost = {
      id;
      postType;
      title;
      organization;
      examPostName;
      importantDates;
      eligibility;
      applicationFee;
      ageLimit;
      vacancyDetails;
      officialLinks;
      status = #draft;
      tags;
      createdAt = timestamp;
      updatedAt = timestamp;
    };

    posts.add(id, post);
    id;
  };

  public shared ({ caller }) func updatePost(id : Nat, postType : RecruitmentPostType, title : Text, organization : Text, examPostName : Text, importantDates : [KeyValue], eligibility : Text, applicationFee : Text, ageLimit : Text, vacancyDetails : Text, officialLinks : [KeyValue], tags : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update posts");
    };

    let post = switch (posts.get(id)) {
      case (null) { Runtime.trap("Post not found") };
      case (?existing) { existing };
    };

    let updated : RecruitmentPost = {
      id = post.id;
      postType;
      title;
      organization;
      examPostName;
      importantDates;
      eligibility;
      applicationFee;
      ageLimit;
      vacancyDetails;
      officialLinks;
      status = post.status;
      tags;
      createdAt = post.createdAt;
      updatedAt = Time.now();
    };

    posts.add(id, updated);
  };

  public shared ({ caller }) func publishPost(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can publish posts");
    };

    let post = switch (posts.get(id)) {
      case (null) { Runtime.trap("Post not found") };
      case (?existing) { existing };
    };

    let updated : RecruitmentPost = {
      id = post.id;
      postType = post.postType;
      title = post.title;
      organization = post.organization;
      examPostName = post.examPostName;
      importantDates = post.importantDates;
      eligibility = post.eligibility;
      applicationFee = post.applicationFee;
      ageLimit = post.ageLimit;
      vacancyDetails = post.vacancyDetails;
      officialLinks = post.officialLinks;
      status = #published;
      tags = post.tags;
      createdAt = post.createdAt;
      updatedAt = Time.now();
    };

    posts.add(id, updated);
  };

  public shared ({ caller }) func unpublishPost(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can unpublish posts");
    };

    let post = switch (posts.get(id)) {
      case (null) { Runtime.trap("Post not found") };
      case (?existing) { existing };
    };

    let updated : RecruitmentPost = {
      id = post.id;
      postType = post.postType;
      title = post.title;
      organization = post.organization;
      examPostName = post.examPostName;
      importantDates = post.importantDates;
      eligibility = post.eligibility;
      applicationFee = post.applicationFee;
      ageLimit = post.ageLimit;
      vacancyDetails = post.vacancyDetails;
      officialLinks = post.officialLinks;
      status = #draft;
      tags = post.tags;
      createdAt = post.createdAt;
      updatedAt = Time.now();
    };

    posts.add(id, updated);
  };

  public shared ({ caller }) func deletePost(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete posts");
    };

    switch (posts.get(id)) {
      case (null) { Runtime.trap("Post not found") };
      case (?_) {
        posts.remove(id);
      };
    };
  };

  // ADMIN API (view all posts including drafts - admins only)
  public query ({ caller }) func getAllPosts() : async [RecruitmentPost] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all posts");
    };
    posts.values().toArray();
  };

  // PUBLIC API (open to all users including guests - published content only)
  public query func getPublishedPosts() : async [RecruitmentPost] {
    posts.values().toArray().filter(func(p : RecruitmentPost) : Bool { p.status == #published });
  };

  public query func getPostById(id : Nat) : async ?RecruitmentPost {
    switch (posts.get(id)) {
      case (null) { null };
      case (?post) {
        // Only return published posts to public
        if (post.status == #published) {
          ?post;
        } else {
          null;
        };
      };
    };
  };

  public query func searchPostsByTag(tag : Text) : async [RecruitmentPost] {
    posts.values().toArray().filter(func(p : RecruitmentPost) : Bool {
      p.status == #published and p.tags.any<Text>(func(t : Text) : Bool { Text.equal(t, tag) });
    });
  };

  public query func getPostsByType(postType : RecruitmentPostType) : async [RecruitmentPost] {
    posts.values().toArray().filter(func(p : RecruitmentPost) : Bool {
      p.status == #published and p.postType == postType;
    });
  };
};
