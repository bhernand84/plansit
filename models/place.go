package places

type Place struct{
	place_id string
	notes string
}

func (p *Place) Add(placeid, notes string){
	p.place_id = placeid
	p.notes = notes
}
func (p *Place) Title() string{
	return p.notes
}
func(p *Place) String() string{
	return p.notes
}
