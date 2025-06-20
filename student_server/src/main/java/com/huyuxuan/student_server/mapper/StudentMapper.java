package com.huyuxuan.student_server.mapper;

import com.huyuxuan.student_server.entity.Student;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface StudentMapper {
    List<Student> findAll();

    Student findById(@Param("sid") Integer sid);

    List<Student> findBySearch(@Param("student") Student student, @Param("fuzzy") Integer fuzzy);


    public boolean updateById(@Param("student") Student student);
    public boolean save(@Param("student") Student student);
    public boolean deleteById(@Param("sid") Integer sid);

}
