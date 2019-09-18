/**
 * @author Arvin
 * @description entity的变量集合
 */

// image： 用图片绘图；Stroke： 内空类型；Fill： 填充类型；
export enum DrawMethod { Image, Stroke, Fill }

// 实体的种类
export enum EntityType { Pool, Pipe }

/*
    线条连接的方式
    1、 中间点连接
    2、 边线连接
 */
export enum LineType { Side, Center }
export enum Status { Narmal, Warning}
