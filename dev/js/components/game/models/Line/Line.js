import Point from "../Point/Point.js";

export default class Line {
    constructor(basePoint) {
        this._beginLine = new BaseLine(basePoint);
        this._endLine = null;
    }

    get beginLine() {
        return this._beginLine;
    }

    set beginLine(value) {
        this._beginLine = value;
    }

    get endLine() {
        return this._endLine;
    }

    set endLine(value) {
        this._endLine = value;
    }

    copyLine() {
        return {
            beginLine: this._beginLine ? this._beginLine.copyWithPosition() : null,
            endLine: this._endLine ? this._endLine.copyWithPosition() : null
        };
    }
}

export class BaseLine {
    constructor(basePoint, points) {
        this._points = points || [new Point()];
        this._basePoint = basePoint || new Point();
        this._currentPosition = 0;
    }


    get basePoint() {
        return this._basePoint;
    }

    set basePoint(value) {
        this._basePoint = value;
    }

    get currentPosition() {
        return this._currentPosition;
    }

    set currentPosition(value) {
        this._currentPosition = value;
    }

    get points() {
        return this._points;
    }

    set points(value) {
        this._points = value;
    }

    size() {
        return this._points.length;
    }

    lastPoint() {
        if (this.size() === 0) {
            return null;
        }
        return this.getRealPoint(this.size() - 1);
    }

    addPoint(point, relative) {
        if (!relative) {
            point.x -= this._basePoint.x;
            point.y -= this._basePoint.y;
        }

        point.x = Math.round(point.x);
        point.y = Math.round(point.y);

        this._points.push(point);
    }

    addPointByInd(point, ind) {
        if (ind < 0 || ind > this._points.length) {
            return;
        }

        point.x -= this._basePoint.x;
        point.y -= this._basePoint.y;

        this._points.splice(ind, 0, point);
    }

    getRealPoint(index) {
        if (index < 0 || index >= this.size()) {
            return null;
        }
        return Point.sum(this._points[index], this._basePoint);
    }

    getOriginPoint(index) {
        if (index < 0 || index >= this.size()) {
            return null;
        }
        return this._points[index].copy();
    }

    copyWithPosition() {
        let newLine = this.copy();
        newLine._currentPosition = this._currentPosition;

        return newLine;
    }

    copy() {
        let newLine = new BaseLine(this.copyBasePoint());
        newLine._points = this.copyPoints();

        return newLine;
    }

    copyPoints() {
        let points = [];
        this._points.forEach((point) => {
            points.push(point.copy());
        });

        return points;
    }

    copyBasePoint() {
        return this._basePoint.copy();
    }

    makeJsonObj() {
        const obj = {};
        obj.base_point = {x: this._basePoint.x, y: this._basePoint.y};
        obj.points = [];
        this._points.forEach((point) => {
            obj.points.push({x: point.x, y: point.y});
        });

        return obj;
    }
}
