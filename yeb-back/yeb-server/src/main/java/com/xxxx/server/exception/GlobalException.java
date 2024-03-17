package com.xxxx.server.exception;

import com.xxxx.server.pojo.RespBean;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;

/***
 * 全局异常处理
 * 控制器的增强类，如果发生异常，并且符合我们类中自定义的一个拦截异常类时，就会被拦截
 *@author:Czy
 *@data:2022/12/13
 ***/
@RestControllerAdvice
public class GlobalException {

    @ExceptionHandler(SQLException.class)
    private RespBean mySqlException(SQLException e) {
        if (e instanceof SQLIntegrityConstraintViolationException) {
            return RespBean.error("该数据有关联数据，操作失败");
        }
        return RespBean.error("数据库异常，操作失败");
    }
}
