class Point {
    constructor(x,y, data) {
        this.x = x;
        this.y = y;
        this.userData = data;
    }
}

class Rectangle {
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(point) {
        return (
            point.x >= this.x - this.w &&
            point.x < this.x + this.w &&
            point.y >= this.y - this.h &&
            point.y < this.y + this.h );
    }

    intersects(range) {
        // two rectangle don't intersect if the top edge of one is lower than the bottom edge of the other, etc. repeat check for all edges.
        return !(
            range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h );
    }
}

class Circle {
    constructor(x,y,r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.rS = r*r;
    }

    contains(point) {
        let dY = point.y-this.y;
        let dX = point.x-this.x;
        return (dX*dX + dY*dY <= this.rS);
    }

    intersects(range) {
        //intersects rectangle
        return !(
            range.x - range.w > this.x + this.r ||
            range.x + range.w < this.x - this.r ||
            range.y - range.h > this.y + this.r ||
            range.y + range.h < this.y - this.r );
    }
}

class QuadTree {
    constructor(boundary, n) {
        this.boundary = boundary;
        this.capacity = n;
        this.points = [];
        this.divided = false;
    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;
        let c = this.capacity;

        let tr = new Rectangle(x + w/2, y - h/2, w/2, h/2); 
        let tl = new Rectangle(x - w/2, y - h/2, w/2, h/2); 
        let bl = new Rectangle(x - w/2, y + h/2, w/2, h/2); 
        let br = new Rectangle(x + w/2, y + h/2, w/2, h/2);     

        this.topright = new QuadTree(tr, c);
        this.topleft = new QuadTree(tl, c);
        this.bottomleft = new QuadTree(bl, c);
        this.bottomright = new QuadTree(br, c);
        
        this.divided = true;
    }

    insert(point) {
        // only insert points within own boundary
        if (!this.boundary.contains(point)) {
            return;
        }
        // add it if the capacity is not full.
        if (this.points.length < this.capacity) {
            this.points.push(point);
        }
        // if full add it to a subdivision. 
        else if (!this.divided) {
            this.subdivide();
        } else if (this.divided) {
            this.topright.insert(point);
            this.topleft.insert(point);
            this.bottomleft.insert(point);
            this.bottomright.insert(point);
        }
    }

    query(range, found) {
        if (!found) {
            found = [];
        }
        if (!this.boundary.intersects(range)) {
            return;
        } else {
            for (let p of this.points) {
                if (range.contains(p)) {
                    found.push(p);
                }
            }
            // recursive part
            if (this.divided) {
                this.topright.query(range, found);
                this.topleft.query(range, found);
                this.bottomleft.query(range, found);
                this.bottomright.query(range, found);
            }
        }
        return found;
    }


    show() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;
        
        strokeWeight(1);
        stroke(21,9,92,1);
        noFill();
        rect(x-w,y-h,w*2,h*2);

        if (this.divided) {
            this.topright.show();
            this.topleft.show();
            this.bottomleft.show();
            this.bottomright.show();
        }

        for (let p of this.points) {
            strokeWeight(4);
            point(p.x,p.y);
        }
    }

}