package com.Programming2.Paint.AOP;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Aspect
@Component
public class AspectLogging {
    @Before(value = "execution(* com.Programming2.Paint.Controllers.shapeController.*(..))")
    public void BeforeAdvice(JoinPoint TheMethod) {
        String Name = "";
        if (Objects.equals(TheMethod.getSignature().getName(), "createShape") || Objects.equals(TheMethod.getSignature().getName(), "modifyShape")) {
            Object[] Type = TheMethod.getArgs();
            Name = (String) Type[1];
            Name = Name + " With ID " + Type[2].toString();
        } else if (Objects.equals(TheMethod.getSignature().getName(), "restart")) {
            Name = "-> Clear All Stored Data";
        } else if (Objects.equals(TheMethod.getSignature().getName(), "redo")) {
            Name = "-> To Next Movement";
        } else if (Objects.equals(TheMethod.getSignature().getName(), "undo")) {
            Name = "-> To Previous Movement";
        }

        System.out.println("Before : " + TheMethod.getSignature().getName() + " " + Name);
    }

    @AfterReturning(value = "execution(* com.Programming2.Paint.Controllers.shapeController.*(..))")
    public void AfterAdvice(JoinPoint TheMethod) {
        String Name = "";
        if (Objects.equals(TheMethod.getSignature().getName(), "createShape") || Objects.equals(TheMethod.getSignature().getName(), "modifyShape")) {
            Object[] Type = TheMethod.getArgs();
            Name = (String) Type[1];
            Name = Name + " With ID " + Type[2].toString();
        } else if (Objects.equals(TheMethod.getSignature().getName(), "restart")) {
            Name = "-> All Stored Data Cleared";
        } else if (Objects.equals(TheMethod.getSignature().getName(), "redo")) {
            Name = "-> To Next Movement";
        } else if (Objects.equals(TheMethod.getSignature().getName(), "undo")) {
            Name = "-> To Previous Movement";
        }

        System.out.println("Success After : " + TheMethod.getSignature().getName() + " " + Name);
    }
}
