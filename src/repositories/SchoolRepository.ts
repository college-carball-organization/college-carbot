/*******************************************************************************
 * FILE: SchoolRepository
 * DESCRIPTION:
 *  Repository for custom School entity methods.
 ******************************************************************************/

import Fuse from 'fuse.js'
import { EntityRepository, Repository } from "typeorm";
import { School } from '../entities/School'

@EntityRepository(School)
export class SchoolRepository extends Repository<School> {

    /**
     * Takes in an identifying string and returns a list of schools
     * ranked by which is most likely to be the expected school using
     * fuzzy search.
     */
    async findFuzzySchools(school: string) : Promise<School[]>{
        let schools: School[] =  await this.createQueryBuilder("schools").getMany();
        const searchOptions = {
            shouldSort: true,
            threshold: 0.15,
            distance: 20,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
                "name",
                "abbr"
            ]
        };
        return new Fuse(schools, searchOptions).search(school);
    }

}