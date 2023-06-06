import { chain, cos, matrix, sin } from "mathjs";
import {
  deltaT,
  toDegree,
  toRadian,
  vehicleConst,
} from "@/compositions/Consts";

/**
 *
 * @param {number} x m
 * @param {number} y m
 * @param {number} theta Grad
 * @param {number} vL m/s
 * @param {number} vR m/s
 * @returns {{x: number, y: number, theta: number}} neue Pose
 */
export function calculateNewPose(x, y, theta, vL, vR) {
  theta = toRadian(theta);
  let newPose = [0, 0, 0];
  if (vL === vR) {
    newPose = straight(x, y, theta, vR);
  } else if (vL === -vR) {
    newPose = turn(x, y, theta, vL);
  } else {
    newPose = curve(x, y, theta, vL, vR);
  }
  return { x: newPose[0], y: newPose[1], theta: toDegree(newPose[2]) };
}

/**
 * Spezialfall für Geradeausfahrten: vL === vR
 * @param x
 * @param y
 * @param theta
 * @param v
 * @returns {number[]}
 */
function straight(x, y, theta, v) {
  return [x + v * cos(theta) * deltaT, y + v * sin(theta) * deltaT, theta];
}

/**
 * Spezialfall für Drehungen auf der Stelle: vL === -vR
 * @param x
 * @param y
 * @param theta
 * @param v
 * @returns {number[]}
 */
function turn(x, y, theta, v) {
  return [x, y, theta + (2 * v * deltaT) / vehicleConst.b];
}

/**
 * Allgemeiner Fall der Kurvenfahrt
 * @param x
 * @param y
 * @param theta
 * @param vL
 * @param vR
 * @returns {math.MathArray}
 */
function curve(x, y, theta, vL, vR) {
  let r = (vehicleConst.b / 2) * ((vL + vR) / (vR - vL));
  let omega = (vL - vR) / vehicleConst.b;
  let icrX = x - r * sin(theta);
  let icrY = y + r * cos(theta);
  let rotationMatrix = matrix([
    [cos(omega * deltaT), sin(omega * deltaT), 0],
    [-sin(omega * deltaT), cos(omega * deltaT), 0],
    [0, 0, 1],
  ]);
  let translationToOrigin = matrix([x - icrX, y - icrY, theta]);
  let translationToICR = matrix([icrX, icrY, omega * deltaT]);
  return chain(rotationMatrix)
    .multiply(translationToOrigin)
    .add(translationToICR)
    .done()
    .toArray();
}
