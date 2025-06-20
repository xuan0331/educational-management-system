import Vue from 'vue';
import VueRouter from 'vue-router';
import login from '../views/login/index';
import admin from '../views/Admin/index';
import adminHome from '../views/Admin/home';
import studentManage from '../views/Admin/studentManage/index';
import addStudent from "@/views/Admin/studentManage/addStudent";
import studentList from "@/views/Admin/studentManage/studentList";
import editorStudent from "@/views/Admin/studentManage/editorStudent";
import teacherManage from "@/views/Admin/teacherManage/index";
import addTeacher from "@/views/Admin/teacherManage/addTeacher";
import editorTeacher from "@/views/Admin/teacherManage/editorTeacher";
import courseManage from "@/views/Admin/courseManage/index";
import addCourse from "@/views/Admin/courseManage/addCourse";
import teacher from "@/views/Teacher/index";
import queryStudent from "@/views/Admin/studentManage/queryStudent";
import queryTeacher from "@/views/Admin/teacherManage/queryTeacher";
import student from "@/views/Student/index";
import editorCourse from "@/views/Admin/courseManage/editorCourse";
import courseList from "@/views/Admin/courseManage/courseList";
import queryCourse from "@/views/Admin/courseManage/queryCourse";
import offerCourse from "@/views/Teacher/offerCourse";
import teacherHome from "@/views/Teacher/home";
import setCourse from "@/views/Teacher/setCourse";
import studentHome from "@/views/Student/home";
import myOfferCourse from "@/views/Teacher/myOfferCourse";
import CourseTeacherManage from "@/views/Admin/selectCourseManage/index";
import queryCourseTeacher from "@/views/Admin/selectCourseManage/queryCourseTeacher";
import studentSelectCourseManage from "@/views/Student/selectCourse/index";
import selectCourse from "@/views/Student/selectCourse/selectCourse";
import querySelectedCourse from "@/views/Student/selectCourse/querySelectedCourse";
import studentCourseGrade from "@/views/Student/courseGrade/index";
import queryCourseGrade from "@/views/Student/courseGrade/queryCourseGrade";
import queryGradeCourse from "@/views/Admin/gradeCourseManage/queryGradeCourse";
import editorGradeCourse from "@/views/Admin/gradeCourseManage/editorGradeCourse";
import teacherGradeCourseManage from "@/views/Teacher/teacherGradeCourseManage/index";
import teacherQueryGradeCourse from "@/views/Teacher/teacherGradeCourseManage/teacherQueryGradeCourse";
import teacherEditorGradeCourse from "@/views/Teacher/teacherGradeCourseManage/teacherEditorGradeCourse";
import updateInfo from "@/components/updateInfo";

Vue.use(VueRouter);

const parallaxLayout = {
  leftMenu: {
    width: '220px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    textColor: '#e6e6e6',
    activeTextColor: '#409EFF'
  },
  rightContent: {
    paddingLeft: '220px',
    background: 'transparent'
  }
};

const routes = [
  {
    path: '/',
    name: 'index',
    component: login,
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: {
      fullScreen: true
    }
  },
  {
    path: '/admin',
    name: 'admin',
    redirect: '/adminHome',
    component: admin,
    meta: {
      requireAuth: true,
      ...parallaxLayout
    },
    children: [
      {
        path: '/adminHome',
        name: '你好，管理员',
        component: adminHome,
        meta: {
          requireAuth: true,
          parallaxBackground: {
            imageUrl: '/img/admin-bg.jpg',
            height: '100vh'
          }
        },
        children: [
          {
            path: '/adminHome',
            name: '管理员主页',
            component: adminHome,
            meta: { requireAuth: true }
          }
        ]
      },
      {
        path: '/studentManage',
        name: '学生管理',
        component: studentManage,
        meta: { requireAuth: true },
        children: [
          {
            path: '/addStudent',
            name: '添加学生',
            component: addStudent,
            meta: { requireAuth: true }
          },
          {
            path: '/studentList',
            name: '学生列表',
            component: studentList,
            meta: { requireAuth: true }
          },
          {
            path: '/editorStudent',
            name: '编辑学生',
            component: editorStudent,
            meta: { requireAuth: true }
          },
          {
            path: '/queryStudent',
            name: '搜索',
            component: queryStudent,
            meta: { requireAuth: true },
            children: [
              {
                path: '/queryStudent/studentList',
                component: studentList,
                meta: { requireAuth: true }
              }
            ]
          }
        ]
      },

      {
        path: '/teacherManage',
        name: '教师管理',
        component: teacherManage,
        meta: { requireAuth: true },
        children: [
          {
            path: '/addTeacher',
            name: '添加教师',
            component: addTeacher,
            meta: { requireAuth: true }
          },
          {
            path: '/queryTeacher',
            name: '教师列表',
            component: queryTeacher,
            meta: { requireAuth: true }
          },
          {
            path: '/editorTeacher',
            name: '编辑教师',
            component: editorTeacher,
            meta: { requireAuth: true }
          }
        ]
      },
      {
        path: '/courseManage',
        name: '课程管理',
        component: courseManage,
        meta: { requireAuth: true },
        children: [
          {
            path: '/addCourse',
            name: '添加课程',
            component: addCourse,
            meta: { requireAuth: true }
          },
          {
            path: '/queryCourse',
            name: '搜索课程',
            component: queryCourse,
            meta: { requireAuth: true },
            children: [
              {
                path: '/courseList',
                name: '课程列表',
                component: courseList,
                meta: { requireAuth: true }
              }
            ]
          },
          {
            path: '/editorCourse',
            name: '编辑课程',
            component: editorCourse,
            meta: { requireAuth: true }
          }
        ]
      },
      {
        path: '/CourseTeacher',
        name: '开课表管理',
        component: CourseTeacherManage,
        meta: { requireAuth: true },
        children: [
          {
            path: '/queryCourseTeacher',
            name: '开课管理',
            component: queryCourseTeacher,
            meta: { requireAuth: true }
          }
        ]
      },
      {
        name: '学生成绩管理',
        path: "/gradeCourseManage",
        component: studentManage,
        meta: { requireAuth: true },
        children: [
          {
            path: '/queryGradeCourse',
            name: '学生成绩查询',
            component: queryGradeCourse,
            meta: { requireAuth: true }
          },
          {
            path: '/editorGradeCourse',
            name: '编辑',
            component: editorGradeCourse,
            meta: { requireAuth: true }
          }
        ]
      }
    ]
  },
  {
    path: '/teacher',
    name: 'teacher',
    component: teacher,
    redirect: '/teacherHome',
    meta: {
      requireAuth: true,
      ...parallaxLayout
    },
    children: [
      {
        path: '/teacherHome',
        name: '你好，老师',
        meta: { requireAuth: true },
        component: teacherHome,
        children: [
          {
            path: '/teacherHome',
            name: '教师主页',
            meta: { requireAuth: true },
            component: teacherHome
          }
        ]
      },
      {
        path: '/updateInfo',
        name: '教师编辑',
        component: updateInfo,
        meta: { requireAuth: true },
        children: [
          {
            path: '/updateInfoHome',
            name: '编辑教师信息',
            component: updateInfo,
            meta: { requireAuth: true }
          }
        ]
      },
      {
        path: '/courseManage',
        name: '课程设置',
        meta: { requireAuth: true },
        component: setCourse,
        children: [
          {
            path: '/myOfferCourse',
            name: '我开设的课程',
            component: myOfferCourse,
            meta: { requireAuth: true }
          },
          {
            path: '/offerCourse',
            name: '开设课程',
            component: offerCourse,
            meta: { requireAuth: true }
          }
        ]
      },
      {
        name: '教师成绩管理',
        path: '/teacherQueryGradeCourseManage',
        component: teacherGradeCourseManage,
        meta: { requireAuth: true },
        children: [
          {
            path: '/teacherQueryGradeCourseManage',
            name: '成绩管理',
            component: teacherQueryGradeCourse,
            meta: { requireAuth: true }
          },
          {
            path: '/teacherEditorGradeCourse',
            name: '编辑成绩',
            component: teacherEditorGradeCourse,
            meta: { requireAuth: true }
          }
        ]
      }
    ]
  },
  {
    path: '/student',
    name: 'student',
    component: student,
    redirect: '/studentHome',
    meta: {
      requireAuth: true,
      ...parallaxLayout
    },
    children: [
      {
        path: '/student',
        name: '你好，同学',
        component: studentHome,
        meta: { requireAuth: true },
        children: [
          {
            path: '/studentHome',
            name: '学生主页',
            component: studentHome,
            meta: { requireAuth: true }
          }
        ]
      },
      {
        path: '/updateInfo',
        name: '学生编辑',
        component: updateInfo,
        meta: { requireAuth: true },
        children: [
          {
            path: '/updateInfoHome',
            name: '编辑学生信息',
            component: updateInfo,
            meta: { requireAuth: true }
          }
        ]
      },
      {
        path: '/studentSelectCourseManage',
        name: '选课管理',
        component: studentSelectCourseManage,
        meta: { requireAuth: true },
        children: [
          {
            path: '/studentSelectCourse',
            name: '选课',
            component: selectCourse,
            meta: { requireAuth: true }
          },
          {
            path: '/querySelectedCourse',
            name: '查询课表',
            component: querySelectedCourse,
            meta: { requireAuth: true }
          }
        ]
      },
      {
        path: '/courseGrade',
        name: '学生成绩管理',
        component: studentCourseGrade,
        meta: { requireAuth: true },
        children: [
          {
            path: '/queryCourseGrade',
            name: '成绩查询',
            component: queryCourseGrade,
            meta: { requireAuth: true }
          }
        ]
      }
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash,
        behavior: 'smooth'
      };
    }
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});

router.beforeEach((to, from, next) => {
  console.log(from.path + ' ====> ' + to.path);
  if (to.meta.requireAuth) {
    if (sessionStorage.getItem("token") === 'true') {
      next();
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    }
  } else {
    if (sessionStorage.getItem("token") === 'true') {
      const t = sessionStorage.getItem("type");
      next('/' + t);
    } else {
      next();
    }
  }
});

export default router;