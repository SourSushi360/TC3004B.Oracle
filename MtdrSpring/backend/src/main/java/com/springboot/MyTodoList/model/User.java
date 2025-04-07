package com.springboot.MyTodoList.model;

import javax.persistence.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Entity
@Table(name="USERS")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ID_User;

    @Column(name="ID_TELEGRAM")
    private String idTelegram;

    @Column(name="NAME")
    private String name;

    @Column(name="POSITION")
    private String position;

    public User() {
    }

    public User(int ID_User, String id_Telegram, String name, String position) {
        this.ID_User = ID_User;
        this.idTelegram = id_Telegram;
        this.name = name;
        this.position = position;
    }

    public int getID_User() {
        return ID_User;
    }

    public void setID_User(int ID_User) {
        this.ID_User = ID_User;
    }

    public String getID_Telegram() {
        return idTelegram;
    }

    public void setID_Telegram(String id_Telegram) {
        this.idTelegram = id_Telegram;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }
    
    

    @Override
    public String toString() {
        return "User{" +
                "ID_User=" + ID_User +
                ", id_Telegram='" + idTelegram + '\'' +
                ", name='" + name + '\'' +
                ", position='" + position + '\'' +
                '}';
    }
}