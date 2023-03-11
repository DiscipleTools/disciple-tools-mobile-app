const filterPosts = ({ posts, query, userData }) => {
  if (!query) return posts;
  // eg, {"assigned_to":["me"],"subassigned":["me"],"combine":["subassigned"],"overall_status":["-closed"],"type":["access"],"sort":"overall_status"};
  // TODO: do this dynamically?
  const meList = ["subassigned", "coached_by", "shared_with"];
  if (query?.fields) query = query.fields;
  return posts?.filter((post) => {
    let queryKeys = Object.keys(query);
    queryKeys = queryKeys.filter((key) => key !== "sort" && key !== "combine");
    if (!queryKeys?.length > 0) return true;
    const queryMatches = queryKeys?.map((key) => {
      let queryKey = query?.[key];
      if (!queryKey) return false;
      let postKey = post?.[key]?.key || post?.[key];

      // eg, { "comment_ID": '*' ...}
      if (postKey === "*") return true;

      /*
       * NOTE: "post?.[key]?.key" is checked prior to "post?.[key]", and
       * check negated properties first
       */

      if (typeof queryKey?.[0] === "string" && queryKey?.[0]?.startsWith("-")) {
        if (queryKey[0] === undefined || queryKey[0].slice(1) !== postKey) {
          return true;
        }
      }

      if (Array.isArray(queryKey) && queryKey?.includes(postKey)) {
        return true;
      }

      // special handler for "favorite" field
      if (queryKey?.[0] === "1" && postKey === true) {
        return true;
      }

      /*
       * NOTE: userData is accessed from cache (bc problematic to access it via
       * 'use-my-user' hook from within 'use-list' for some unknown reason)
       */
      //const userData = SWRConfig.default.cache.get(MyUserDataURL);

      if (
        key === "assigned_to" &&
        queryKey.includes("me") &&
        postKey?.id === userData?.ID?.toString()
      ) {
        return true;
      }

      // handle case where record is both "assigned_to" and "subassigned" to user
      if (
        key === "subassigned" &&
        queryKey.includes("me") &&
        query?.["assigned_to"]?.includes("me")
      ) {
        return true;
      }

      // handler for "me" queries (like "assigned_to" query, but list of values)
      // TODO: API BUG (need "contact_id" property since "subassigned".ID refers to contact ID, not user ID)
      //postKey?.find((_item) => _item?.ID === userData?.ID?.toString())
      if (
        meList.includes(key) &&
        queryKey.includes("me") &&
        postKey?.find(
          (_item) => _item?.post_title === userData?.profile?.username
        )
      ) {
        return true;
      }

      return false;
    });

    // if none of the rules have failed (false), then return true for post
    if (!queryMatches?.includes(false)) {
      return true;
    }

    // default to false, to be cautious
    return false;
  });
};

describe("helpers/index::filterPosts::contacts", () => {
  //const posts = require("./contacts_p2.json")?.posts;
  const posts1 = require("./contacts1k.json")?.posts;
  const posts2 = require("./contacts2k.json")?.posts;
  const posts3 = require("./contacts3k.json")?.posts;
  const posts4 = require("./contacts4k.json")?.posts;
  const posts5 = require("./contacts5k.json")?.posts;
  const posts6 = require("./contacts6k.json")?.posts;
  const posts7 = require("./contacts7k.json")?.posts;
  const posts = [
    ...posts1,
    ...posts2,
    ...posts3,
    ...posts4,
    ...posts5,
    ...posts6,
    ...posts7,
  ];
  const userData = require("./userData.json");
  let query = {};
  test("empty query", () => {
    expect(filterPosts({ posts, query: null, userData })).toEqual(posts);
  });
  test("empty posts", () => {
    expect(filterPosts({ posts: [], query, userData })).toEqual([]);
  });
  /*
  test("empty userData w/ 'me' query", () => {
    query = {"assigned_to":["me"],"subassigned":["me"],"combine":["subassigned"],"overall_status":["-closed"],"type":["access"],"sort":"overall_status"};
    expect(filterPosts({ posts, query, userData: {} })).toEqual(??);
  });
  */
  // default filters
  test("filter by 'all_my_contacts'", () => {
    query = { sort: "-post_date" };
    //expect(filterPosts({ posts, query, userData })).toEqual(posts);
    expect(filterPosts({ posts, query, userData })?.length).toEqual(6089);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(16);
  });
  test("filter by 'favorite'", () => {
    query = { fields: { favorite: ["1"] }, sort: "name" };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(4);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(3);
  });
  // TODO: filter by sorting records by "last_modified" and choosing top 30
  test.skip("filter by 'recent'", () => {
    query = { dt_recent: true };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(30); // always 30
  });
  test("filter by 'personal'", () => {
    query = { overall_status: ["-closed"], sort: "name", type: ["personal"] };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(8);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(0);
  });
  test("filter by 'placeholder'", () => {
    query = {
      type: ["placeholder"],
      overall_status: ["-closed"],
      sort: "name",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(0);
  });
  test("filter by 'my_coached'", () => {
    query = {
      coached_by: ["me"],
      overall_status: ["-closed"],
      sort: "seeker_path",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(5);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(0);
  });
  test("filter by 'my_all'", () => {
    query = {
      assigned_to: ["me"],
      subassigned: ["me"],
      combine: ["subassigned"],
      overall_status: ["-closed"],
      type: ["access"],
      sort: "overall_status",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(77);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(0);
  });
  test("filter by 'my_new'", () => {
    query = {
      assigned_to: ["me"],
      subassigned: ["me"],
      combine: ["subassigned"],
      type: ["access"],
      overall_status: ["new"],
      sort: "seeker_path",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(9);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(0);
  });
  test("filter by 'my_active'", () => {
    query = {
      assigned_to: ["me"],
      subassigned: ["me"],
      combine: ["subassigned"],
      type: ["access"],
      overall_status: ["active"],
      sort: "seeker_path",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(68);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(0);
  });
  test("filter by 'my_update_needed'", () => {
    query = {
      assigned_to: ["me"],
      subassigned: ["me"],
      combine: ["subassigned"],
      overall_status: ["active"],
      requires_update: [true],
      type: ["access"],
      sort: "seeker_path",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(66);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(0);
  });
  test("filter by 'my_none'", () => {
    query = {
      assigned_to: ["me"],
      subassigned: ["me"],
      combine: ["subassigned"],
      overall_status: ["active"],
      seeker_path: ["none"],
      type: ["access"],
      sort: "name",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(61);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(0);
  });
  test("filter by 'my_established'", () => {
    query = {
      assigned_to: ["me"],
      subassigned: ["me"],
      combine: ["subassigned"],
      overall_status: ["active"],
      seeker_path: ["established"],
      type: ["access"],
      sort: "name",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(1);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(0);
  });
  test("filter by 'my_scheduled'", () => {
    query = {
      assigned_to: ["me"],
      subassigned: ["me"],
      combine: ["subassigned"],
      overall_status: ["active"],
      seeker_path: ["scheduled"],
      type: ["access"],
      sort: "name",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(2);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(0);
  });
  test("filter by 'my_met'", () => {
    query = {
      assigned_to: ["me"],
      subassigned: ["me"],
      combine: ["subassigned"],
      overall_status: ["active"],
      seeker_path: ["met"],
      type: ["access"],
      sort: "name",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(3);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(0);
  });
  test("filter by 'my_ongoing'", () => {
    query = {
      assigned_to: ["me"],
      subassigned: ["me"],
      combine: ["subassigned"],
      overall_status: ["active"],
      seeker_path: ["ongoing"],
      type: ["access"],
      sort: "name",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(1);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(0);
  });
  test("filter by 'all_dispatch'", () => {
    query = {
      overall_status: ["-closed"],
      type: ["access"],
      sort: "overall_status",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(5230); // 5233?
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(0);
  });
  test("filter by 'all_new'", () => {
    query = { overall_status: ["new"], type: ["access"], sort: "seeker_path" };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(138);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(1);
  });
  test("filter by 'all_unassignable'", () => {
    query = {
      overall_status: ["unassignable"],
      type: ["access"],
      sort: "seeker_path",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(865);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(0);
  });
  test("filter by 'all_unassigned'", () => {
    query = {
      overall_status: ["unassigned"],
      type: ["access"],
      sort: "seeker_path",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(2366);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(1);
  });
  test("filter by 'all_assigned'", () => {
    query = {
      overall_status: ["assigned"],
      type: ["access"],
      sort: "seeker_path",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(26);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(1);
  });
  test("filter by 'all_active'", () => {
    query = {
      overall_status: ["active"],
      type: ["access"],
      sort: "seeker_path",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(1036); // theme UI count wrong (1039)
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(2); // theme UI count wrong (1039)
  });
  test("filter by 'all_update_needed'", () => {
    query = {
      overall_status: ["active"],
      requires_update: [true],
      type: ["access"],
      sort: "seeker_path",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(1032); // theme UI count wrong (1035)
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(0); // theme UI count wrong (1035)
  });
  test("filter by 'all_none'", () => {
    query = {
      overall_status: ["active"],
      seeker_path: ["none"],
      type: ["access"],
      sort: "name",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(311); // theme UI count wrong (314)
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(0); // theme UI count wrong (314)
  });
  test("filter by 'all_attempted'", () => {
    query = {
      overall_status: ["active"],
      seeker_path: ["attempted"],
      type: ["access"],
      sort: "name",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(177);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(0);
  });
  test("filter by 'all_established'", () => {
    query = {
      overall_status: ["active"],
      seeker_path: ["established"],
      type: ["access"],
      sort: "name",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(152);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(0);
  });
  test("filter by 'all_scheduled'", () => {
    query = {
      overall_status: ["active"],
      seeker_path: ["scheduled"],
      type: ["access"],
      sort: "name",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(197);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(0);
  });
  test("filter by 'all_met'", () => {
    query = {
      overall_status: ["active"],
      seeker_path: ["met"],
      type: ["access"],
      sort: "name",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(120);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(0);
  });
  test("filter by 'all_ongoing'", () => {
    query = {
      overall_status: ["active"],
      seeker_path: ["ongoing"],
      type: ["access"],
      sort: "name",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(70);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(0);
  });
  test("filter by 'all_coaching'", () => {
    query = {
      overall_status: ["active"],
      seeker_path: ["coaching"],
      type: ["access"],
      sort: "name",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(8);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(0);
  });
  test("filter by 'all_paused'", () => {
    query = {
      overall_status: ["paused"],
      type: ["access"],
      sort: "seeker_path",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(799);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(2);
  });
  test("filter by 'all_closed'", () => {
    query = {
      overall_status: ["closed"],
      type: ["access"],
      sort: "seeker_path",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(813);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(5);
  });
  // custom filters
  test("filter by 'my_subassigned'", () => {
    query = { subassigned: ["me"], sort: "overall_status" };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(1);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(0);
  });
  // TODO: API bug - not returning any property to filter on
  test.skip("filter by 'my_shared'", () => {
    query = { shared_with: ["me"], sort: "name" };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(98);
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(16);
  });
  test("filter by '1598060481.73'", () => {
    query = { people_groups: ["33"], sort: "-last_modified" };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(0); // theme UI count wrong (4)
    //expect(filterPosts({ posts, query, userData })?.length).toEqual(0);
  });
});

/*
  test("filter by 'my_unassigned'", () => {
    query = {"assigned_to":["me"],"subassigned":["me"],"combine":["subassigned"],"type":["access"],"overall_status":["unassigned"],"sort":"seeker_path"};
    expect(filterPosts({ posts, query, userData })?.length).toEqual(0); //1);
  });
  test("filter by 'my_assigned'", () => {
    query = {"assigned_to":["me"],"subassigned":["me"],"combine":["subassigned"],"type":["access"],"overall_status":["assigned"],"sort":"seeker_path"};
    expect(filterPosts({ posts, query, userData })?.length).toEqual(0); //1); //3);
  });
  test("filter by 'my_closed'", () => {
    query = {"assigned_to":["me"],"subassigned":["me"],"combine":["subassigned"],"type":["access"],"overall_status":["closed"],"sort":"seeker_path"};
    expect(filterPosts({ posts, query, userData })?.length).toEqual(0); //3); //5);
  });
*/

describe("helpers/index::filterPosts::groups", () => {
  const posts = require("./groups.json")?.posts;
  const userData = require("./userData.json");
  let query = {};
  test("empty query", () => {
    expect(filterPosts({ posts, query: null, userData })).toEqual(posts);
  });
  test("empty posts", () => {
    expect(filterPosts({ posts: [], query, userData })).toEqual([]);
  });
  test("empty userData w/ 'me' query", () => {
    query = {
      assigned_to: ["me"],
      subassigned: ["me"],
      combine: ["subassigned"],
      overall_status: ["-closed"],
      type: ["access"],
      sort: "overall_status",
    };
    expect(filterPosts({ posts, query, userData: {} })?.length).toEqual(0);
  });
  test("filter by '1672659888.77'", () => {
    query = { fields: [{ group_status: ["inactive"] }], sort: "name" };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(0);
  });
  test("filter by 'my_all'", () => {
    query = { assigned_to: ["me"], sort: "group_status" };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(21);
  });
  test("filter by 'my_active'", () => {
    query = {
      assigned_to: ["me"],
      group_status: ["active"],
      sort: "group_type",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(21);
  });
  test("filter by 'my_update_needed'", () => {
    query = {
      assigned_to: ["me"],
      group_status: ["active"],
      requires_update: [true],
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(20);
  });
  test("filter by 'my_pre-group'", () => {
    query = {
      assigned_to: ["me"],
      group_status: ["active"],
      group_type: ["pre-group"],
      sort: "name",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(2);
  });
  test("filter by 'my_group'", () => {
    query = {
      assigned_to: ["me"],
      group_status: ["active"],
      group_type: ["group"],
      sort: "name",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(11);
  });
  test("filter by 'my_church'", () => {
    query = {
      assigned_to: ["me"],
      group_status: ["active"],
      group_type: ["church"],
      sort: "name",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(5);
  });
  test("filter by 'my_team'", () => {
    query = {
      assigned_to: ["me"],
      group_status: ["active"],
      group_type: ["team"],
      sort: "name",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(3);
  });
  test("filter by 'all'", () => {
    query = { sort: "group_type" };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(153); // theme UI count wrong (154)
  });
  test("filter by 'favorite'", () => {
    query = { fields: { favorite: ["1"] }, sort: "name" };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(4);
  });
  test.skip("filter by 'recent'", () => {
    query = { dt_recent: true };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(0);
  });
  test("filter by 'all_active'", () => {
    query = { group_status: ["active"], sort: "group_type" };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(147); // theme UI count wrong (148)
  });
  test("filter by 'all_update_needed'", () => {
    query = { group_status: ["active"], requires_update: [true] };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(146); // theme UI count wrong (147)
  });
  test("filter by 'all_pre-group'", () => {
    query = {
      group_status: ["active"],
      group_type: ["pre-group"],
      sort: "name",
    };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(9);
  });
  test("filter by 'all_group'", () => {
    query = { group_status: ["active"], group_type: ["group"], sort: "name" };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(92); // theme UI count wrong (93)
  });
  test("filter by 'all_church'", () => {
    query = { group_status: ["active"], group_type: ["church"], sort: "name" };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(24);
  });
  test("filter by 'all_team'", () => {
    query = { group_status: ["active"], group_type: ["team"], sort: "name" };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(20);
  });
  test("filter by 'all_inactive'", () => {
    query = { group_status: ["inactive"], sort: "group_type" };
    expect(filterPosts({ posts, query, userData })?.length).toEqual(6);
  });
});
