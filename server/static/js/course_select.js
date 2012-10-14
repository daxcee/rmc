define(
['ext/jquery', 'ext/underscore', 'ext/underscore.string', 'ext/select2',
'rmc_backbone', 'course', 'util'],
function($, _, _s, select2, RmcBackbone, course, util) {

// TODO(Sandy): Decide naming. Is CourseSelect good? Maybe CourseSelectBox
  var CourseSelect = RmcBackbone.Model.extend({
    // TODO(Sandy): Restructure this and add field for placeholder text
    // TODO(Sandy): Allow callback on select
    defaults: {
      // List of courses to show in the drop down (ordered same as array).
      course_selections: [{
        code: 'SCI 238',
        name: 'Introduction to Astronomy omg omg omg'
      }, {
        code: 'ECON 102',
        name: 'Macro Economics AWESOME COURSE'
      }]
    },

    initialize: function(attributes) {
      if (!attributes || !attributes.course_selections) {
        // TODO(Sandy): Maybe we can strategically fetch this once somewhere
        // before to reduce wait time on first click?
        if (util.supportsLocalStorage() &&
            window.localStorage.courseSelectData) {
          console.log('nah i got it');
          // XXX(Sandy)[uw]: Allow the server to force clear cache
          this.set('course_selections',
            $.parseJSON(window.localStorage.courseSelectData));
        } else {
          console.log('querying server');
          $.getJSON('/api/courses/codes-names', function(respObj) {
            console.log('code-names ajax return');
            sortedObj = _.sortBy(respObj, function(c) {
              return c.code;
            });

            if (util.supportsLocalStorage()) {
              window.localStorage.courseSelectData = JSON.stringify(sortedObj);
            }
            this.set('course_selections', sortedObj);
          });
        }
      }
    }
  });

  var CourseSelectView = RmcBackbone.View.extend({
    className: 'course-select',
    template: _.template($('#course-select-tpl').html()),

    // TODO(Sandy): Provide reset method on view/

    render: function() {
      this.$el.html(this.template());

      var courseSelectData = this.model.get('course_selections');
      var queryHandler = function(options) {
        return courseSelectQuery(courseSelectData, options);
      }

      // Handle the autocomplete course box
      this.$('.course-select-input').select2({
        dropdownCssClass: 'course-select-override-select2',
        formatResult: courseSelectFormatResult,
        formatSelection: courseSelectFormatSelection,
        query: queryHandler
      }).change(selectOnChange);

      return this;
    }
  });

  // Internal functions

  var courseSelectFormatResult = function(item) {
    var c = item.course;
    var courseModel = new course.CourseModel({
      code: c.code,
      name: c.name
    });
    // XXX(sandy): make course select not return ratings view
    var courseView = new course.CourseView({
      courseModel: courseModel,
      tagname: 'li'
    });

    var render = courseView.render().$el;
    return render;
  }

  var courseSelectFormatSelection = function(e) {
    // TODO(Sandy): Container content when element selected
    return 'Add a course';
  }

  var courseSelectQuery = function(courseSelectData, options) {
    var courseSelectData;
    data = {
      results: []
    };

    if (options.context) {
      // Course select data already filtered, just a paging call
      courseSelectData = options.context.filteredCourses;
    } else {
      courseSelectData = courseSelectData;

      if (!courseSelectData) {
        // Data fetch might not have finished yet, wait a bit
        console.log('setting timeout to wait for async request');
        setTimeout(courseSelectQuery(options), 500);
        return;
      }

      var filterCoursesOnString = function(courses, searchTerm) {
        var keywords = searchTerm.toLowerCase().split(/\s+/);
        var keywordRegExps = new Array();
        _.each(keywords, function(keyword) {
          keywordRegExps.push(new RegExp('\\b' + keyword));
        });

        var courseResults = [];
        _.each(courses, function(c) {
          // XXX(Sandy)[uw]: Give preference to course codes. Eg. "econ" should
          // yield "ECON 101, ECON 102, etc" over "ACTSC 615 - Economics"

          // Filter on the course code (with and without the space) and name
          var str = c.code + " " + c.name + " " + c.code.replace(/\s+/g, '');
          str = str.toLowerCase();

          var match = _.all(keywordRegExps, function(keywordRegExp) {
            return keywordRegExp.test(str);
          });

          if (match) {
            courseResults.push(c);
          }
        });
        return courseResults;
      }

      courseResults = filterCoursesOnString(courseSelectData, options.term)

      data.context = {
        filteredCourses: courseResults
      };
    }

    // Fetch courses for the current page
    // TODO(Sandy): Where do constants go?
    var RESULTS_PER_PAGE = 10;

    var curPage = options.page;
    if (curPage * RESULTS_PER_PAGE < courseResults.length) {
      data.more = true;
    }

    var start = (curPage - 1) * RESULTS_PER_PAGE;
    var end = Math.min(curPage * RESULTS_PER_PAGE, courseResults.length);
    for (var i = start; i < end; ++i) {
      c = courseResults[i];
      data.results.push({
        id: c.code,
        text: 'qwe',
        course: c
      });
    }
    options.callback(data);
    console.log('quer end');
  };

  var selectOnChange = function(event) {
    console.log('selectOnChange');
    console.log(event);
    console.log($('.course-select').select2('val'));
    $('.course-select').select2('val', 'eg.');
  };

  return {
    CourseSelect: CourseSelect,
    CourseSelectView: CourseSelectView
    //CourseSelectCollection: CourseSelectCollection
  };
});
