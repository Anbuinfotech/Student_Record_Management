package com.srms.studentrecord.service;

import com.srms.studentrecord.entity.Student;
import com.srms.studentrecord.exception.DuplicateEmailException;
import com.srms.studentrecord.exception.ResourceNotFoundException;
import com.srms.studentrecord.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    @Autowired
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    public Student createStudent(Student student) {
        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new DuplicateEmailException("A student with email " + student.getEmail() + " already exists");
        }
        return studentRepository.save(student);
    }

    public Student updateStudent(Long id, Student studentDetails) {
        Student student = getStudentById(id);

        if (!student.getEmail().equalsIgnoreCase(studentDetails.getEmail())
                && studentRepository.existsByEmail(studentDetails.getEmail())) {
            throw new DuplicateEmailException("A student with email " + studentDetails.getEmail() + " already exists");
        }

        student.setName(studentDetails.getName());
        student.setEmail(studentDetails.getEmail());
        student.setPhone(studentDetails.getPhone());
        student.setCourse(studentDetails.getCourse());
        student.setYear(studentDetails.getYear());
        student.setMarks(studentDetails.getMarks());
        student.setEnrollmentDate(studentDetails.getEnrollmentDate());
        student.setAddress(studentDetails.getAddress());

        return studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        Student student = getStudentById(id);
        studentRepository.delete(student);
    }

    public List<Student> searchByName(String name) {
        return studentRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Student> searchByCourse(String course) {
        return studentRepository.findByCourseContainingIgnoreCase(course);
    }
}
