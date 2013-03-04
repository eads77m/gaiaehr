<?php
/**
 * Matcha::connect
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
 
class MatchaErrorHandler extends Matcha
{
	
	public $__logFile;
	
	/**
	 * function __errorProcess($errorException):
	 * Handle the error of an exception
	 * TODO: It could be more elaborated and handle other things.
	 * for example log file for GaiaEHR.
	 */
	static public function __errorProcess($errorException)
	{
		// TODO: A switch to output a formatted HTML for the trace.
        $trace = $errorException->getTrace();
		error_log('Matcha::connect: ('.$trace[0]['class'].') '.$errorException->getMessage() );
		return $errorException;
	}

	/**
	 * function __errorLogFile:
	 * A file that MatchaErrorHandler will put all the errors 
	 * events generated by Matcha::connect
	 */
	static public function __errorLogFile($file = NULL)
	{
		$__logFile = $file;
	}
}