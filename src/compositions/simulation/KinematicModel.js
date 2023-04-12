import { chain, cos, matrix, sin } from "mathjs";
import { b, deltaT, toDegree, toRadian } from "@/compositions/Consts";

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
  newPose[2] = toDegree(newPose[2]);
  return newPose;
}

function straight(x, y, theta, v) {
  return [x + v * cos(theta) * deltaT, y + v * sin(theta) * deltaT, theta];
}

function turn(x, y, theta, v) {
  return [x, y, theta + (2 * v * deltaT) / b];
}

function curve(x, y, theta, vL, vR) {
  let r = (b / 2) * ((vL + vR) / (vR - vL));
  let omega = (vL - vR) / b;
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
