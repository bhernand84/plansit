// Code generated by protoc-gen-go.
// source: plansitproto.proto
// DO NOT EDIT!

/*
Package models is a generated protocol buffer package.

It is generated from these files:
	plansitproto.proto

It has these top-level messages:
	PlansItProto
*/
package models

import proto "github.com/golang/protobuf/proto"
import math "math"

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = math.Inf

type PlansItProto struct {
	GoogleId         *string              `protobuf:"bytes,1,req" json:"GoogleId,omitempty"`
	Email            *string              `protobuf:"bytes,2,req" json:"Email,omitempty"`
	Name             *string              `protobuf:"bytes,3,opt,name=name" json:"name,omitempty"`
	Trips            []*PlansItProto_Trip `protobuf:"bytes,4,rep,name=trips" json:"trips,omitempty"`
	XXX_unrecognized []byte               `json:"-"`
}

func (m *PlansItProto) Reset()         { *m = PlansItProto{} }
func (m *PlansItProto) String() string { return proto.CompactTextString(m) }
func (*PlansItProto) ProtoMessage()    {}

func (m *PlansItProto) GetGoogleId() string {
	if m != nil && m.GoogleId != nil {
		return *m.GoogleId
	}
	return ""
}

func (m *PlansItProto) GetEmail() string {
	if m != nil && m.Email != nil {
		return *m.Email
	}
	return ""
}

func (m *PlansItProto) GetName() string {
	if m != nil && m.Name != nil {
		return *m.Name
	}
	return ""
}

func (m *PlansItProto) GetTrips() []*PlansItProto_Trip {
	if m != nil {
		return m.Trips
	}
	return nil
}

type PlansItProto_Trip struct {
	Name             *string               `protobuf:"bytes,1,opt,name=name" json:"name,omitempty"`
	DateCreated      *string               `protobuf:"bytes,2,opt,name=dateCreated" json:"dateCreated,omitempty"`
	Description      *string               `protobuf:"bytes,3,opt,name=description" json:"description,omitempty"`
	Length           *string               `protobuf:"bytes,4,opt,name=length" json:"length,omitempty"`
	Places           []*PlansItProto_Place `protobuf:"bytes,5,rep,name=places" json:"places,omitempty"`
	XXX_unrecognized []byte                `json:"-"`
}

func (m *PlansItProto_Trip) Reset()         { *m = PlansItProto_Trip{} }
func (m *PlansItProto_Trip) String() string { return proto.CompactTextString(m) }
func (*PlansItProto_Trip) ProtoMessage()    {}

func (m *PlansItProto_Trip) GetName() string {
	if m != nil && m.Name != nil {
		return *m.Name
	}
	return ""
}

func (m *PlansItProto_Trip) GetDateCreated() string {
	if m != nil && m.DateCreated != nil {
		return *m.DateCreated
	}
	return ""
}

func (m *PlansItProto_Trip) GetDescription() string {
	if m != nil && m.Description != nil {
		return *m.Description
	}
	return ""
}

func (m *PlansItProto_Trip) GetLength() string {
	if m != nil && m.Length != nil {
		return *m.Length
	}
	return ""
}

func (m *PlansItProto_Trip) GetPlaces() []*PlansItProto_Place {
	if m != nil {
		return m.Places
	}
	return nil
}

type PlansItProto_Place struct {
	PlaceId          *string                  `protobuf:"bytes,1,opt,name=placeId" json:"placeId,omitempty"`
	Notes            *string                  `protobuf:"bytes,2,opt,name=notes" json:"notes,omitempty"`
	Categories       []*PlansItProto_Category `protobuf:"bytes,3,rep,name=categories" json:"categories,omitempty"`
	XXX_unrecognized []byte                   `json:"-"`
}

func (m *PlansItProto_Place) Reset()         { *m = PlansItProto_Place{} }
func (m *PlansItProto_Place) String() string { return proto.CompactTextString(m) }
func (*PlansItProto_Place) ProtoMessage()    {}

func (m *PlansItProto_Place) GetPlaceId() string {
	if m != nil && m.PlaceId != nil {
		return *m.PlaceId
	}
	return ""
}

func (m *PlansItProto_Place) GetNotes() string {
	if m != nil && m.Notes != nil {
		return *m.Notes
	}
	return ""
}

func (m *PlansItProto_Place) GetCategories() []*PlansItProto_Category {
	if m != nil {
		return m.Categories
	}
	return nil
}

type PlansItProto_Category struct {
	Name             *string `protobuf:"bytes,1,opt,name=name" json:"name,omitempty"`
	Description      *string `protobuf:"bytes,2,opt,name=description" json:"description,omitempty"`
	XXX_unrecognized []byte  `json:"-"`
}

func (m *PlansItProto_Category) Reset()         { *m = PlansItProto_Category{} }
func (m *PlansItProto_Category) String() string { return proto.CompactTextString(m) }
func (*PlansItProto_Category) ProtoMessage()    {}

func (m *PlansItProto_Category) GetName() string {
	if m != nil && m.Name != nil {
		return *m.Name
	}
	return ""
}

func (m *PlansItProto_Category) GetDescription() string {
	if m != nil && m.Description != nil {
		return *m.Description
	}
	return ""
}

func init() {
}
