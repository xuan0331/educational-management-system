package com.huyuxuan.student_server.mapper;

import com.huyuxuan.student_server.entity.Course;
import com.huyuxuan.student_server.entity.CourseTeacher;
import com.huyuxuan.student_server.entity.CourseTeacherInfo;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
@Mapper
public interface CourseTeacherMapper {

    @Insert("INSERT INTO studentms.ct (cid, tid, term) VALUES (#{cid}, #{tid}, #{term})")
    boolean insertCourseTeacher(@Param("cid") Integer cid,
                                @Param("tid") Integer tid,
                                @Param("term") String term);

    List<CourseTeacher> findBySearch(@Param("cid") Integer cid,
                                     @Param("tid") Integer tid,
                                     @Param("term") String term);

    List<Course> findMyCourse(@Param("tid") Integer tid,
                              @Param("term") String term);

    List<CourseTeacherInfo> findCourseTeacherInfo(@Param("tid") Integer tid,
                                                  @Param("tname") String tname,
                                                  @Param("tFuzzy") Integer tFuzzy,
                                                  @Param("cid") Integer cid,
                                                  @Param("cname") String cname,
                                                  @Param("cFuzzy") Integer cFuzzy);

    @Delete("DELETE FROM studentms.ct WHERE cid = #{c.cid} AND tid = #{c.tid}")
    boolean deleteById(@Param("c") CourseTeacher courseTeacher);
}
