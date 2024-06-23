export interface VirtualTour {
    createdAt: Date;
    deletedAt: Date;
    updatedAt: Date;
    id: string;
    virtualTourId: string;
    virtualTourRoom: VirtualTourRoom[];
}

export interface VirtualTourRoom {
    virtualTourId: string;
    id: string;
    name: string;
    pictures: VirtualTourPicture[];
    positions: VirtualRoomAnimationPosition[];
}

export interface VirtualTourPicture {
    id: string;
    virtualTourRoomId: string;
    filePath: string;
    filename: string;
}

export interface VirtualTourRoomPosition {
    id?: string;
    time: Date;
    virtualTourRoomId: string;
    yaw: number;
    pitch: number;
    zoom: number;
}

export interface VirtualRoomAnimationPosition {
    id: string;
    time: Date;
    virtualTourRoomId: string;
    pitch: number;
    yaw: number;
    zoom: number;
}

export interface VirtualTourDataItem {
    time: Date;
    virtualTourRoomId: string;
    yaw: number;
    pitch: number;
    zoom: number;
}
