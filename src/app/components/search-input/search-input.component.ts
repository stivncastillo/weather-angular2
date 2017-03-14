import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import {Observable} from 'rxjs/Rx';

import { CitiesService } from '../../services/cities.service';
import { WeatherService } from '../../services/weather.service';
import { City } from '../../models/city';

@Component({
	selector: 'search-input',
	templateUrl: './search-input.component.html',
	styleUrls: ['./search-input.component.css'],
	providers: [
		CitiesService,
		WeatherService
	]
})

export class SearchInputComponent implements OnInit {

	public cities: City[];
	myControl = new FormControl();
	filteredOptions: Observable<City[]>;

	@Input() showWeatherDetail: boolean;
	@Output() onShowWeatherDetail = new EventEmitter<boolean>();

	constructor(
		private _citiesService: CitiesService,
		private _weatherService: WeatherService
	) {	}

	ngOnInit() {
		// consumir servicio de ciudades
		this._citiesService.getCities().subscribe(
			result => {
				this.cities = result;
				this.filteredOptions = this.myControl.valueChanges
					.startWith(null)
					.map(city => city && typeof city === 'object' ? city.name : city)
					.map(name => name ? this.filter(name) : this.cities.slice(1));
			}, 
			error => console.log(error));
	}
	// Evento, seleccionar ciudad
	selectCity (city: City){
		console.log(city);
		
		this._weatherService.getWeather(city._id).subscribe(
			result => {
				console.log(result);
			},

			error => console.log(error)
		);

		this.onShow(true);
	}

	// Filtrar por el nombre de la ciudad
	filter(name: string): City[] {
		return this.cities.filter(option => new RegExp(name, 'gi').test(option.name)); 
	}
	// Mostrar el nombre de la ciudad cuando se selecciona
	displayFn(city: City): string {
		return city ? city.name : null;
	}
	// Mostrar card del clima
	onShow(agreed: boolean) {
		this.onShowWeatherDetail.emit(agreed);
		this.showWeatherDetail = true;
	}
	

}
