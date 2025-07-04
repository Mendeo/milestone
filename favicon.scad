$fn = 200;

combine(10, 100, 30, 50);

module combine(w_flagpole, h_flagpole, w_flag, l_flag)
{
	color("black")
	flagpole(w_flagpole, h_flagpole);
	translate([w_flagpole + 0.2 * w_flagpole, h_flagpole - w_flag - 0.1 * h_flagpole])
	color("red")
	flag(w_flag, l_flag);
}

module flagpole(w, h)
{
	hNew = h - w;
	translate([0, w / 2])
	union()
	{
		square([w, hNew]);
		translate([w / 2, hNew])
		circle(d = w);
		translate([w / 2, 0])
		circle(d = w);
	}
}

module flag(w, l)
{
	wNew = w - w / 10;
	translate([w / 20, w / 20])
	minkowski()
	{
		polygon([[0, 0], [0, wNew], [l, wNew / 2]]);
		circle(d = w / 10);
	}
}