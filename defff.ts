
//########data
let data_tx = pins.createBuffer(38);
let gait_mode = 0; //robot status
let rc_spd_cmd_X = 0.00 //x_speed
let rc_spd_cmd_y = 0.00 //y_speed
let rc_att_rate_cmd = 0.00 // Turn to speed
let rc_spd_cmd_z = 0.00 //mobile speed
let rc_pos_cmd = 0.00 //height
let rc_att_cmd_x = 0.00 //Pitch
let rc_att_cmd_y = 0.00 //Side swing
let rc_att_cmd = 0.00 //Heading
let robot_mode = 0
let robot_mode_1 = 0
let state = 0
let Action_group = 0x00
let Action_group_status = 0x00
let M_Action_group_status = 0x00

//########SPI
let SSLen = 50
let InfoTemp = pins.createBuffer(SSLen)
let ToSlaveBuf = pins.createBuffer(SSLen)
let SfoCnt = 0
//let DaHeader = 0x2B
//let DaTail = 0xEE
let usb_send_cnt = 0
let cnt = 0

//########Steering gear||舵机
let ToSlaveBuf_1 = pins.createBuffer(SSLen)
let InfoTemp_1 = pins.createBuffer(SSLen)
let usb_send_cnt_1 = 0
let SfoCnt_1 = 0
let DaHeader_1 = 0x2B
let DaTail_1 = 0xEE

//########Joint angle control||关节角度控制
let ToSlaveBuf_2 = pins.createBuffer(SSLen)
let InfoTemp_2 = pins.createBuffer(SSLen)
let usb_send_cnt_2 = 0
let SfoCnt_2 = 0
let DaHeader_2 = 0x2B
let DaTail_2 = 0xEE
let FL_d = 45.0
let FL_x = 90.0
let FL_c = 0.0
let FR_d = 45.0
let FR_x = 90.0
let FR_c = 0.0
let HL_d = 45.0
let HL_x = 90.0
let HL_c = 0.0
let HR_d = 45.0
let HR_x = 90.0
let HR_c = 0.0

//########Image Identification||图像识别
//------------definition--------------
let num = 0
let DaHeader = 0xaa //包头
let DaTail = 0xAB //包尾
let color_id = 0 //基础颜色位置
let linecolor_id = 0 //线颜色位置
let find_ID = 0 //接收功能ID
let Function_ID = 0 //发送功能ID
let Identify_RX = pins.createBuffer(10)  //接收的缓冲区长度未定
let Select_Tx = pins.createBuffer(5)  //开启功能选择：包头，功能，基础颜色位置，线颜色，包尾
let Colorarr = pins.createBuffer(3)

//mall ball
let Ball_status = 0x00  //status
let Ball_X = 0x00, Ball_Y = 0x00 //x-axis, y-axis
let Ball_W = 0x00, Ball_H = 0x00 //Width Height
let Ball_pixels = 0x00  //Number of pixels

//Line inspection
let Line_detect = 0x00 //Detect
let Line_effect = 0x00 //The effect of the identification line
let Line_angle = 0x00 //angle
let Line_position = 0x00 //position

let Shapes_ID = 0

//QR code
let Identify_x = 0x00, Identify_y = 0x00, Identify_z = 0x00
let Identify_Flip_x = 0x00, Identify_Flip_y = 0x00, Identify_Flip_z = 0x00
let Identify_status = 0x00, Identify_pattern = 0x00





let CRC_L = 0x00
let CRC_H = 0x00

let CRC_tx_L = 0x00
let CRC_tx_H = 0x00

let CRC_tx_L1 = 0x00
let CRC_tx_H1 = 0x00

let Function_s = 0      //Function selection (1: two-dimensional code 2: small ball 3: line patrol)
let Function_c = 0x00   //function code



//########Speech Recognition||语音识别
let get_data = 0x00 //retrieve data
let voice_speed = 7 //speed



//########SPI_int||SPI初始化
function SPI_Init() {
    pins.digitalWritePin(DigitalPin.P16, 1)
    pins.digitalWritePin(DigitalPin.P12, 1)
    pins.spiPins(DigitalPin.P15, DigitalPin.P14, DigitalPin.P13)
    pins.spiFrequency(1000000)
    led.enable(false)
    //serial.writeNumber(1)
}

//########SPI data transmission/reception||SPI数据发送/接收
function SPI_Send() {
    if (state == 1) {
        SPICom_Walk()
        pins.digitalWritePin(DigitalPin.P16, 0)
        pins.digitalWritePin(DigitalPin.P12, 0)
        for (let i = 0; i < 200; i++);
        for (let i = 0; i < SSLen; i++) {
            InfoTemp[i] = pins.spiWrite(ToSlaveBuf[i])
        }
        pins.digitalWritePin(DigitalPin.P12, 1)
        pins.digitalWritePin(DigitalPin.P16, 1)
        //serial.writeBuffer(InfoTemp)
        //serial.writeBuffer(ToSlaveBuf)
        SPI_unpacking()
        basic.pause(1)
    }
}
//########Control data||控制数据
function SPICom_Walk() {
    usb_send_cnt = 0
    let cnt_reg = 0
    let sum = 0
    ToSlaveBuf[usb_send_cnt++] = DaHeader; //头
    ToSlaveBuf[usb_send_cnt++] = SSLen - 2; //固定长度
    ToSlaveBuf[usb_send_cnt++] = 1;  //功能码

    ToSlaveBuf[usb_send_cnt++] = gait_mode;
    ToSlaveBuf[usb_send_cnt++] = Action_group_status
    ToSlaveBuf[usb_send_cnt++] = Action_group
    get_float_hex(rc_spd_cmd_X)
    get_float_hex(rc_spd_cmd_y)
    get_float_hex(rc_att_rate_cmd)
    get_float_hex(rc_spd_cmd_z)
    get_float_hex(rc_pos_cmd) //0.1
    get_float_hex(rc_att_cmd_x)
    get_float_hex(rc_att_cmd_y)
    get_float_hex(rc_att_cmd)
    ToSlaveBuf[SSLen - 1] = DaTail;
}

//########Data analysis||数据解析
function SPI_unpacking() {
    cnt = 0
    if (InfoTemp[0] == 0x2B && InfoTemp[2] == 0x80) {
        robot_mode = InfoTemp[3]
        M_Action_group_status = InfoTemp[4]
    }
    //serial.writeNumber(robot_mode)
}

//########Stand in place||原地站立
function Standing() {
    if (robot_mode == 1)
        return
    gait_mode = 5
    while (1) {
        SPI_Send()
        if (robot_mode == 1 || robot_mode == 0x02) {
            gait_mode = 4
            SPI_Send()
            return;
        }
    }
}

//########Servo SPI data transmission||舵机SPI 数据发送
function SG_SPI_Send() {
    pins.digitalWritePin(DigitalPin.P16, 0)
    pins.digitalWritePin(DigitalPin.P12, 0)
    for (let i = 0; i < 200; i++);
    for (let i = 0; i < SSLen; i++) {
        InfoTemp_1[i] = pins.spiWrite(ToSlaveBuf_1[i])
    }
    //serial.writeBuffer(ToSlaveBuf_1)
    pins.digitalWritePin(DigitalPin.P12, 1)
    pins.digitalWritePin(DigitalPin.P16, 1)
    basic.pause(1)
}

//########Joint SPI data transmission||关节SPI 数据发送
function Joint_SPI_Send() {

    Joint_data()
    pins.digitalWritePin(DigitalPin.P16, 0)
    pins.digitalWritePin(DigitalPin.P12, 0)
    for (let i = 0; i < 200; i++);
    for (let i = 0; i < SSLen; i++) {
        InfoTemp_2[i] = pins.spiWrite(ToSlaveBuf[i])
    }
    pins.digitalWritePin(DigitalPin.P12, 1)
    pins.digitalWritePin(DigitalPin.P16, 1)
    //SPI_unpacking()
    basic.pause(1)

    //    }
}

function Joint_data() {
    usb_send_cnt = 0
    let cnt_reg = 0
    let sum = 0
    ToSlaveBuf[usb_send_cnt++] = DaHeader_2; //头
    ToSlaveBuf[usb_send_cnt++] = SSLen - 2; //固定长度
    ToSlaveBuf[usb_send_cnt++] = 0x03;  //功能码

    ToSlaveBuf[usb_send_cnt++] = 0x01;
    get_float_hex(FL_d)
    get_float_hex(FL_x)
    get_float_hex(FL_c)
    get_float_hex(FR_d)
    get_float_hex(FR_x)
    get_float_hex(FR_c)
    get_float_hex(HL_d)
    get_float_hex(HL_x)
    get_float_hex(HL_c)
    get_float_hex(HR_d)
    get_float_hex(HR_x)
    get_float_hex(HR_c)

    ToSlaveBuf[SSLen - 1] = DaTail_2;
}

//功能和颜色选择发送
function IRecognitionSettings() {
    num = 0
    Select_Tx[num++] = DaHeader
    Select_Tx[num++] = Function_ID //功能
    Select_Tx[num++] = color_id //基础颜色
    Select_Tx[num++] = linecolor_id //线颜色
    Select_Tx[num++] = DaTail
    serial.writeBuffer(Select_Tx)
    basic.pause(100)
}


// 功能切换     数组清空赋0
function IRecognitionToggle() {
    num = 0
    Select_Tx[num++] = DaHeader
    for (let i = 1; i < 3; i++)
        Select_Tx[num++] = 0x00
    Select_Tx[num++] = DaTail
    serial.writeBuffer(Select_Tx)
    basic.pause(100)
}

//串口接收
function Uart_receive() {
    Identify_RX = serial.readBuffer(0)//若要避免等待数据，请将长度设置为立即返回缓冲数据:0
    if (Identify_RX[0] == DaHeader) { //包尾无法判断，因为不同返回数组的长度不一样
        switch (Function_ID) {
            case 1: Identify_Color(Identify_RX); break; //颜色数据接收
            case 2: Ball_rd(Identify_RX); break; //小球数据接收
            case 3: Line_inspection(Identify_RX); break; //巡线数据接收
            case 4: Identify_Shapes(Identify_RX); break; //形状数据接收
            case 5: Identify_collection(Identify_RX); break; //标签数据接收
            // case 6: //巡线加形状
            // case 7: //巡线加颜色
            // case 8: //巡线加标签
            default: return
        }
    }
    return
}

//颜色数据接收
function Identify_Color(Colorarr = pins.createBuffer(3)) {
    if (Colorarr[0] == DaHeader && Colorarr[2] == DaTail) {
        color_id = Colorarr[1]
    }
    return color_id //红1蓝2黄3绿4
}

//小球数据接收
function Ball_rd(Ballarr = pins.createBuffer(8)) {
    if (Ballarr[0] == DaHeader && Ballarr[7] == DaTail) {
        Ball_status = Ballarr[1]
        Ball_X = Ballarr[2]
        Ball_Y = Ballarr[3]
        Ball_W = Ballarr[4]
        Ball_H = Ballarr[5]
        Ball_pixels = Ballarr[6]
    }
}


//巡线数据接收
function Line_inspection(Linearr = pins.createBuffer(7)) {
    if (Linearr[0] == DaHeader && Linearr[6] == DaTail) {
        Line_detect = Linearr[1]
        Line_effect = Linearr[2]
        Line_angle = Linearr[3]
        Line_position = Linearr[4]
    }
}

//形状数据接收
function Identify_Shapes(Linearr = pins.createBuffer(7)) {
    if (Linearr[0] == DaHeader && Linearr[6] == DaTail) {
        Shapes_ID = Linearr[5]
    }
    return Shapes_ID
}

//标签数据接收
function Identify_collection(Tagarr = pins.createBuffer(10)) {
    if (Tagarr[0] == DaHeader && Tagarr[9] == DaTail) {
        Identify_status = Tagarr[1]
        Identify_pattern = Tagarr[2]
        Identify_x = Tagarr[3]
        Identify_y = Tagarr[4]
        Identify_z = Tagarr[5]
        Identify_Flip_x = Tagarr[6]
        Identify_Flip_y = Tagarr[7]
        Identify_Flip_z = Tagarr[8]
    }

}


//Voice recognition reception||语音识别接收
function voice_rx() {
    let rx_data = pins.createBuffer(4) //Create an array
    rx_data = serial.readBuffer(0) //Read data in RX buffer
    if (rx_data[0] == 0xF4 && rx_data[1] == 0x06 && rx_data[3] == 0xff) {
        get_data = rx_data[2]
    }
}

//Voice initialization||语音初始化
function Voice_init() {
    Quadruped.init()
    Quadruped.Height(10)
    Quadruped.Start()
}

//Voice data analysis||语音数据解析
function voice_data() {

    switch (get_data) {
        case 0x02: Voice_init(); break;
        case 0x03: Quadruped.Stop(); break;
        case 0x04: Quadruped.Reset; Quadruped.Stand(); break;
        case 0x05: Quadruped.Reset; Quadruped.Gait(gait.Trot); break;
        //case 0x06: Quadruped.Reset; Quadruped.Gait(gait.Crawl); break;
        case 0x07: Quadruped.Height(10); break;
        case 0x08: Quadruped.Height(4); break;
        case 0x09: Quadruped.Reset; Quadruped.Control_s(Mov_dir.For, voice_speed, 50); break;
        case 0x0A: Quadruped.Reset; Quadruped.Control_s(Mov_dir.Bac, voice_speed, 50); break;
        case 0x0B: Quadruped.Reset; Quadruped.Control_s(Mov_dir.Turn_l, voice_speed, 50); break;
        case 0x0C: Quadruped.Reset; Quadruped.Control_s(Mov_dir.Turn_r, voice_speed, 50); break;
        case 0x0D: Quadruped.Reset; Quadruped.Control_s(Mov_dir.Shift_l, voice_speed, 50); break;
        case 0x0E: Quadruped.Reset; Quadruped.Control_s(Mov_dir.Shift_r, voice_speed, 50); break;
        case 0x0F: Quadruped.Reset; Quadruped.Control_s(Mov_dir.For, voice_speed, 0); Quadruped.Control_s(Mov_dir.Shift_l, voice_speed, 50); break;
        case 0x10: Quadruped.Reset; Quadruped.Control_s(Mov_dir.Bac, voice_speed, 0); Quadruped.Control_s(Mov_dir.Shift_l, voice_speed, 50); break;
        case 0x11: Quadruped.Reset; Quadruped.Control_s(Mov_dir.For, voice_speed, 0); Quadruped.Control_s(Mov_dir.Shift_r, voice_speed, 50); break;
        case 0x12: Quadruped.Stand(); Quadruped.Control_s(Mov_dir.For, voice_speed, 0); Quadruped.Control_s(Mov_dir.Shift_l, voice_speed, 50); break;
        case 0x13: voice_speed++; break;
        case 0x14: voice_speed--; break;
        case 0x15: Quadruped.Reset; Quadruped.Control_a(Mov_ang.Look_d, 10, 20); break;
        case 0x16: Quadruped.Reset; Quadruped.Control_a(Mov_ang.Look_u, 10, 20); break;
        case 0x17: Quadruped.Reset; Quadruped.Control_a(Mov_ang.L_swing, 10, 20); break;
        case 0x18: Quadruped.Reset; Quadruped.Control_a(Mov_ang.R_swing, 10, 20); break;
        default: return

    }

}

//########gesture||手势
let Init_Register_Array = [
    [0xEF, 0x00],
    [0x37, 0x07],
    [0x38, 0x17],
    [0x39, 0x06],
    [0x41, 0x00],
    [0x42, 0x00],
    [0x46, 0x2D],
    [0x47, 0x0F],
    [0x48, 0x3C],
    [0x49, 0x00],
    [0x4A, 0x1E],
    [0x4C, 0x20],
    [0x51, 0x10],
    [0x5E, 0x10],
    [0x60, 0x27],
    [0x80, 0x42],
    [0x81, 0x44],
    [0x82, 0x04],
    [0x8B, 0x01],
    [0x90, 0x06],
    [0x95, 0x0A],
    [0x96, 0x0C],
    [0x97, 0x05],
    [0x9A, 0x14],
    [0x9C, 0x3F],
    [0xA5, 0x19],
    [0xCC, 0x19],
    [0xCD, 0x0B],
    [0xCE, 0x13],
    [0xCF, 0x64],
    [0xD0, 0x21],
    [0xEF, 0x01],
    [0x02, 0x0F],
    [0x03, 0x10],
    [0x04, 0x02],
    [0x25, 0x01],
    [0x27, 0x39],
    [0x28, 0x7F],
    [0x29, 0x08],
    [0x3E, 0xFF],
    [0x5E, 0x3D],
    [0x65, 0x96],
    [0x67, 0x97],
    [0x69, 0xCD],
    [0x6A, 0x01],
    [0x6D, 0x2C],
    [0x6E, 0x01],
    [0x72, 0x01],
    [0x73, 0x35],
    [0x74, 0x00],
    [0x77, 0x01]]

let Init_PS_Array = [
    [0xEF, 0x00],
    [0x41, 0x00],
    [0x42, 0x00],
    [0x48, 0x3C],
    [0x49, 0x00],
    [0x51, 0x13],
    [0x83, 0x20],
    [0x84, 0x20],
    [0x85, 0x00],
    [0x86, 0x10],
    [0x87, 0x00],
    [0x88, 0x05],
    [0x89, 0x18],
    [0x8A, 0x10],
    [0x9f, 0xf8],
    [0x69, 0x96],
    [0x6A, 0x02],
    [0xEF, 0x01],
    [0x01, 0x1E],
    [0x02, 0x0F],
    [0x03, 0x10],
    [0x04, 0x02],
    [0x41, 0x50],
    [0x43, 0x34],
    [0x65, 0xCE],
    [0x66, 0x0B],
    [0x67, 0xCE],
    [0x68, 0x0B],
    [0x69, 0xE9],
    [0x6A, 0x05],
    [0x6B, 0x50],
    [0x6C, 0xC3],
    [0x6D, 0x50],
    [0x6E, 0xC3],
    [0x74, 0x05]]

let Init_Gesture_Array = [
    [0xEF, 0x00],
    [0x41, 0x00],
    [0x42, 0x00],
    [0xEF, 0x00],
    [0x48, 0x3C],
    [0x49, 0x00],
    [0x51, 0x10],
    [0x83, 0x20],
    [0x9F, 0xF9],
    [0xEF, 0x01],
    [0x01, 0x1E],
    [0x02, 0x0F],
    [0x03, 0x10],
    [0x04, 0x02],
    [0x41, 0x40],
    [0x43, 0x30],
    [0x65, 0x96],
    [0x66, 0x00],
    [0x67, 0x97],
    [0x68, 0x01],
    [0x69, 0xCD],
    [0x6A, 0x01],
    [0x6B, 0xB0],
    [0x6C, 0x04],
    [0x6D, 0x2C],
    [0x6E, 0x01],
    [0x74, 0x00],
    [0xEF, 0x00],
    [0x41, 0xFF],
    [0x42, 0x01]]

const PAJ7620_ID = 0x73
const PAJ7620_REGITER_BANK_SEL = 0xEF

const PAJ7620_BANK0 = 0
const PAJ7620_BANK1 = 1

const GES_RIGHT_FLAG = 1
const GES_LEFT_FLAG = 2
const GES_UP_FLAG = 4
const GES_DOWN_FLAG = 8
const GES_FORWARD_FLAG = 16
const GES_BACKWARD_FLAG = 32
const GES_CLOCKWISE_FLAG = 64
const GES_COUNT_CLOCKWISE_FLAG = 128
const GES_WAVE_FLAG = 1

function GestureWriteReg(addr: number, cmd: number) {

    let buf = pins.createBuffer(2);
    buf[0] = addr;
    buf[1] = cmd;
    pins.i2cWriteBuffer(PAJ7620_ID, buf);
}

function GestureReadReg(addr: number): number {

    let buf = pins.createBuffer(1);
    buf[0] = addr;
    pins.i2cWriteBuffer(PAJ7620_ID, buf);

    let result = pins.i2cReadNumber(PAJ7620_ID, NumberFormat.UInt8LE, false);
    return result;
}




function GestureSelectBank(bank: number): void {
    switch (bank) {
        case 0:
            GestureWriteReg(PAJ7620_REGITER_BANK_SEL, PAJ7620_BANK0);
            break;
        case 1:
            GestureWriteReg(PAJ7620_REGITER_BANK_SEL, PAJ7620_BANK1);
            break;
        default:
            break;
    }

}










































//#################################Data conversion||数据转换######################################################
function DecToBinTail(dec: number, pad: number) {
    let bin = "";
    let i;
    for (i = 0; i < pad; i++) {
        dec *= 2;
        if (dec >= 1) {
            dec -= 1;
            bin += "1";
        }
        else {
            bin += "0";
        }
    }
    return bin;
}

function DecToBinHead(dec: number, pad: number) {
    let bin = "";
    let i;
    for (i = 0; i < pad; i++) {
        bin = parseInt((dec % 2).toString()) + bin;
        dec /= 2;
    }
    return bin;
}

function get_float_hex(decString: number) {
    let dec = decString;
    let sign;
    let signString;
    let decValue = parseFloat(Math.abs(decString).toString());
    let fraction = 0;
    let exponent = 0;
    let ssss = []

    if (decString.toString().charAt(0) == '-') {
        sign = 1;
        signString = "1";
    }
    else {
        sign = 0;
        signString = "0";
    }
    if (decValue == 0) {
        fraction = 0;
        exponent = 0;
    }
    else {
        exponent = 127;
        if (decValue >= 2) {
            while (decValue >= 2) {
                exponent++;
                decValue /= 2;
            }
        }
        else if (decValue < 1) {
            while (decValue < 1) {
                exponent--;
                decValue *= 2;
                if (exponent == 0)
                    break;
            }
        }
        if (exponent != 0) decValue -= 1; else decValue /= 2;

    }
    let fractionString = DecToBinTail(decValue, 23);
    let exponentString = DecToBinHead(exponent, 8);
    let ss11 = parseInt(signString + exponentString + fractionString, 2)
    ToSlaveBuf[usb_send_cnt++] = ((ss11 << 24) >> 24)
    ToSlaveBuf[usb_send_cnt++] = ((ss11 << 16) >> 24)
    ToSlaveBuf[usb_send_cnt++] = ((ss11 << 8) >> 24)
    ToSlaveBuf[usb_send_cnt++] = ((ss11 >> 24))
}

//########################################################################################################
//#######################################CRC #############################################################
let aucCRCHi = [0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
    0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40,
    0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
    0x00, 0xC1, 0x81, 0x40, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41,
    0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
    0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40,
    0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40,
    0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40,
    0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
    0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40,
    0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
    0x00, 0xC1, 0x81, 0x40, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41,
    0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
    0x00, 0xC1, 0x81, 0x40, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41,
    0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41,
    0x00, 0xC1, 0x81, 0x40, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41,
    0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
    0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40,
    0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
    0x00, 0xC1, 0x81, 0x40, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41,
    0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
    0x00, 0xC1, 0x81, 0x40]
let aucCRCLo = [0x00, 0xC0, 0xC1, 0x01, 0xC3, 0x03, 0x02, 0xC2, 0xC6, 0x06, 0x07, 0xC7,
    0x05, 0xC5, 0xC4, 0x04, 0xCC, 0x0C, 0x0D, 0xCD, 0x0F, 0xCF, 0xCE, 0x0E,
    0x0A, 0xCA, 0xCB, 0x0B, 0xC9, 0x09, 0x08, 0xC8, 0xD8, 0x18, 0x19, 0xD9,
    0x1B, 0xDB, 0xDA, 0x1A, 0x1E, 0xDE, 0xDF, 0x1F, 0xDD, 0x1D, 0x1C, 0xDC,
    0x14, 0xD4, 0xD5, 0x15, 0xD7, 0x17, 0x16, 0xD6, 0xD2, 0x12, 0x13, 0xD3,
    0x11, 0xD1, 0xD0, 0x10, 0xF0, 0x30, 0x31, 0xF1, 0x33, 0xF3, 0xF2, 0x32,
    0x36, 0xF6, 0xF7, 0x37, 0xF5, 0x35, 0x34, 0xF4, 0x3C, 0xFC, 0xFD, 0x3D,
    0xFF, 0x3F, 0x3E, 0xFE, 0xFA, 0x3A, 0x3B, 0xFB, 0x39, 0xF9, 0xF8, 0x38,
    0x28, 0xE8, 0xE9, 0x29, 0xEB, 0x2B, 0x2A, 0xEA, 0xEE, 0x2E, 0x2F, 0xEF,
    0x2D, 0xED, 0xEC, 0x2C, 0xE4, 0x24, 0x25, 0xE5, 0x27, 0xE7, 0xE6, 0x26,
    0x22, 0xE2, 0xE3, 0x23, 0xE1, 0x21, 0x20, 0xE0, 0xA0, 0x60, 0x61, 0xA1,
    0x63, 0xA3, 0xA2, 0x62, 0x66, 0xA6, 0xA7, 0x67, 0xA5, 0x65, 0x64, 0xA4,
    0x6C, 0xAC, 0xAD, 0x6D, 0xAF, 0x6F, 0x6E, 0xAE, 0xAA, 0x6A, 0x6B, 0xAB,
    0x69, 0xA9, 0xA8, 0x68, 0x78, 0xB8, 0xB9, 0x79, 0xBB, 0x7B, 0x7A, 0xBA,
    0xBE, 0x7E, 0x7F, 0xBF, 0x7D, 0xBD, 0xBC, 0x7C, 0xB4, 0x74, 0x75, 0xB5,
    0x77, 0xB7, 0xB6, 0x76, 0x72, 0xB2, 0xB3, 0x73, 0xB1, 0x71, 0x70, 0xB0,
    0x50, 0x90, 0x91, 0x51, 0x93, 0x53, 0x52, 0x92, 0x96, 0x56, 0x57, 0x97,
    0x55, 0x95, 0x94, 0x54, 0x9C, 0x5C, 0x5D, 0x9D, 0x5F, 0x9F, 0x9E, 0x5E,
    0x5A, 0x9A, 0x9B, 0x5B, 0x99, 0x59, 0x58, 0x98, 0x88, 0x48, 0x49, 0x89,
    0x4B, 0x8B, 0x8A, 0x4A, 0x4E, 0x8E, 0x8F, 0x4F, 0x8D, 0x4D, 0x4C, 0x8C,
    0x44, 0x84, 0x85, 0x45, 0x87, 0x47, 0x46, 0x86, 0x82, 0x42, 0x43, 0x83,
    0x41, 0x81, 0x80, 0x40]

//CRC check
function usMBCRC16(pucFrame: any, usLen: number) {
    // serial.writeNumber(usLen)
    // serial.writeBuffer(pucFrame)
    let Data_1 = pins.createBuffer(9)
    let Data_2 = pins.createBuffer(2)
    let Data_3
    let usLen_1 = usLen
    Data_1 = pucFrame
    let ucCRCHi = 0xFF
    let ucCRCLo = 0xFF
    let iIndex, i = 0
    while (usLen--) {
        iIndex = (ucCRCLo ^ Data_1[i++])
        ucCRCLo = (ucCRCHi ^ aucCRCHi[iIndex])
        ucCRCHi = aucCRCLo[iIndex]
    }
    Data_3 = ucCRCHi << 8 | ucCRCLo
    CRC_L = Data_3 >> 8
    CRC_H = Data_3 & 0x00ff
    CRC_tx_L = Data_3 >> 8
    CRC_tx_H = Data_3 & 0x00ff

}

//CRC check
function usMBCRC161(pucFrame: any, usLen: number) {
    // serial.writeNumber(usLen)
    // serial.writeBuffer(pucFrame)
    let Data_1 = pins.createBuffer(9)
    let Data_2 = pins.createBuffer(2)
    let Data_3
    let usLen_1 = usLen
    Data_1 = pucFrame
    let ucCRCHi = 0xFF
    let ucCRCLo = 0xFF
    let iIndex = 0
    let i = 1
    while (usLen > 1) {
        usLen--
        iIndex = (ucCRCLo ^ Data_1[i++])
        ucCRCLo = (ucCRCHi ^ aucCRCHi[iIndex])
        ucCRCHi = aucCRCLo[iIndex]
    }
    Data_3 = ucCRCHi << 8 | ucCRCLo
    CRC_L = Data_3 >> 8
    CRC_H = Data_3 & 0x00ff
    CRC_tx_L1 = Data_3 >> 8
    CRC_tx_H1 = Data_3 & 0x00ff

}

//CRC data conversion
function Data_conversion(data1: number, data2: number): number {
    let data3
    let data4 = 0xFFFF
    if (data1 > 0x7F) {
        data3 = ((data1 << 8 | data2) - 1) ^ data4
        return -data3
    }
    else {
        data3 = (data1 << 8) | data2
        return data3
    }

}

