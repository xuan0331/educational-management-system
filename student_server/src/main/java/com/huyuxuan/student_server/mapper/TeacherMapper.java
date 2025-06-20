package com.huyuxuan.student_server.mapper;

import com.huyuxuan.student_server.entity.Teacher;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface TeacherMapper {

    List<Teacher> findAll();

    Teacher findById(@Param("tid") Integer tid);

    List<Teacher> findBySearch(@Param("tid") Integer tid, @Param("tname") String tname, @Param("fuzzy") Integer fuzzy);


    public boolean updateById(@Param("teacher") Teacher teacher);
    public boolean save(@Param("teacher") Teacher teacher);
    public boolean deleteById(@Param("tid") Integer tid);

}
