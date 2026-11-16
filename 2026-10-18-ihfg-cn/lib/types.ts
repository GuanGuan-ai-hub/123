// 数据类型定义 —— 对齐 iHFG 逆向还原的数据模型

export interface ComponentIndex {
  slug: string;      // URL 标识
  name: string;      // 中文名称
  code: string;      // 房间编码,如 1BR-ST-15-I
  category?: string; // 大类(中文)
}

export interface RdsHeader {
  roomCode: string;
  netRoomArea: string;      // 净面积 m²
  hoursOfOperation: string; // 运营时间
  occupancy: string;        // 占用人数
  description: string;      // 描述/特殊要求
  amendments: { date: string; note: string }[]; // 修订历史
}

export interface FinishRow {
  id: string;
  fabric: string;       // 部位
  material: string;     // 材料
  finish: string;       // 饰面
  specification: string;// 规格说明
  selection: string;    // 选型
  remarks: string;      // 备注
}

export interface EquipmentRow {
  id: string;
  description: string;
  category: string;  // 家具/固定装置/金属件/医疗设备…
  group: string;
  qty: string;
  remarks: string;
}

export interface FileItem {
  kind: "pdf" | "revit" | "editor";
  title: string;
  description: string;
  price: string; // "免费" 或 "¥xxx"
}

export interface ComponentDetail extends ComponentIndex {
  rds: RdsHeader;
  finishes: FinishRow[];
  equipment: EquipmentRow[];
  files: FileItem[];
}

export interface Fpu {
  slug: string;
  name: string;       // 中文单元名
  partSlug: string;   // 所属分册
}

export interface GuidelinePart {
  slug: string;
  letter: string;     // A/B/C…
  name: string;       // 中文名
  desc: string;
}
