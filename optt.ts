//############Movement direction||运动方向
enum Mov_dir {
    //% block="Forward"
    For,
    //% block="Backward"
    Bac,
    //% block="Turn_left"
    Turn_l,
    //% block="Turn_right"
    Turn_r,
    //% block="Shift_left"
    Shift_l,
    //% block="Shift_right"
    Shift_r
}

enum Actions {
    //% block="Enable"
    Enable = 1,
    //% block="Not_Enable"
    Not_Enable = 0

}

//############Movement Angle||运动角度
enum Mov_ang {
    //% block="Left_swing"
    L_swing,
    //% block="Right_swing"
    R_swing,
    //% block="Look_down"
    Look_d,
    //% block="Look_up"
    Look_u,
    //% block="Yaw_left"
    Yaw_l,
    //% block="Yaw_right"
    Yaw_r
}

//############Movement gait||运动步态
enum gait {
    //% block="Trot"
    Trot,
    //% block="Crawl"
    Crawl,
    //% block="S_TROT"
    S_TROT,
    //% block="F_TROT"
    F_TROT
}

//############Infrared||红外
enum obstacle_t {
    // block="Obstacle"
    Obstacle = 0,
    // block="No obstacle"
    No_Obstacle = 1

}

//############Human body induction||人体感应
enum obstacle_p {
    // block="Someone"
    Someone = 500,
    // block="unmanned"
    Unmanned = 0

}

//############gesture||手势
enum gesture {
    //% block="From left to right"
    right = 1,
    //% block="Right to left"
    left = 2,
    //% block="Bottom up"
    up = 4,
    //% block="From top to bottom"
    down = 8,
    //% block="Back to front"
    forward = 16,
    //% block="From front to back"
    backward = 32,
    //% block="Clockwise"
    clockwise = 64,
    //% block="Counterclockwise"
    count_clockwise = 128,
    //% block="Wave"
    wave = 256

}

//############Ultrasound||超声波
enum Unit {
    //% block="μs"
    MicroSeconds,
    //% block="cm"
    Centimeters,
    //% block="inches"
    Inches
}

//Joint settings||关节设置
enum sIte {
    //%  block="set up"
    Set = 1,
    //%  block="Not set"
    Not_set = 0,

}

//Joints||关节部位
enum Joints {
    //%  block="Left front leg"
    Left_fr,
    //%  block="Left hind leg"
    Left_hi,
    //%  block="Right front leg"
    Right_fr,
    //%  block="Right hind leg"
    Right_hi,
}

//开启颜色和标签
enum FunctionID {
    ////% block="color label"
    color = 1,
    //% block="Tag label"
    Tag = 5,
}


//识别小球和形状
enum FunctionID1 {
    //% block="Seek ball"
    ball = 2,
    //% block="Shape inspection"
    Shape = 4,
}

//开启黑色/红色识别功能
enum LineColorID {
    //% block="Black"
    Black = 1,
    //% block="Red"
    Red = 2,
}


//颜色ID
enum ColorID {
    //% block="Red"
    Red = 1,
    //% block="Blue"
    Blue = 2,
    //% block="Yellow"
    Yellow = 3,
    //% block="Green"
    Green = 4,
}


//Ball position||球的位置值
enum Ball_Position {
    //% block="status"
    status,
    //% block="X axis"
    X_axis,
    //% block="Y axis"
    Y_axis,
    //% block="Width "
    Width,
    //% block="Depth "
    Depth,
    //% block="Recognition effect"
    Re_effect
}

//Line inspection||巡线
enum Line_Position {
    //% block="status"
    status,
    //% block="Recognition_effect"
    Re_effect,
    //% block="Deviation_angle"
    De_angle,
    //% block="Deviation_position"
    De_position
}

//Tag Position value||标签位置值
enum Tag_Position {
    //% block="Content V"
    Content_V,
    //% block="X axis"
    X_axis,
    //% block="Y axis"
    Y_axis,
    //% block="Z axis"
    Z_axis,
    //% block="X axis flip"
    X_flip,
    //% block="Y axis flip"
    Y_flip,
    //% block="Z axis flip"
    Z_flip,
}